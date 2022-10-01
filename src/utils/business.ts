import { allGoodsTypes, GoodsType, grid, size } from "../constant";
import {
  CardItemType,
  LayerData,
  RandomCardParams,
  RandomLayerListParams,
  RandomLayerParams,
  RelativePosition,
} from "../interface";

import {
  countBy,
  sample,
  cloneDeep,
  isUndefined,
  groupBy,
  sampleSize,
} from "lodash-es";
import {
  generateArray,
  generateCardKey,
  generateCardWithDensity,
  generateRelativePosition,
  getArrayRange,
  hasCollapse,
  isAllowClear,
  isEmptyCard,
  isEmptyOffset,
} from "./help";

const { width, height } = size;

export function getUpdatedCenterCard(
  leftCard: CardItemType,
  centerCard: CardItemType
): CardItemType {
  const {
    type: leftType,
    position: { relativeX: leftRelativeX },
  } = leftCard;
  centerCard.position.relativeX = 0; // 不偏移
  centerCard.position.left = getAbsoluteLeft(
    centerCard.position.relativeX,
    centerCard.position.baseX
  );
  centerCard.position.centerX = centerCard.position.left + width / 2;
  if (!isEmptyCard(leftType) && !isEmptyOffset(leftRelativeX)) {
    centerCard.type = undefined;
  }

  return centerCard;
}

// 生成某一个 card
export function generateRandomCard(params: RandomCardParams): CardItemType {
  const { layerIndex, rowIndex, columnIndex, relativeX, relativeY } = params;

  const baseX = columnIndex * width;
  const baseY = rowIndex * height;
  const left = getAbsoluteLeft(relativeX, baseX);
  const top = getAbsoluteTop(relativeY, baseY);

  const position = {
    layerIndex,
    rowIndex,
    columnIndex,

    // 基准坐标
    baseX,
    baseY,

    // 相对基准的偏移量
    relativeX,
    relativeY,

    // 相对父容器的绝对坐标
    left,
    top,

    // 中心
    centerX: left + width / 2,
    centerY: top + height / 2,
  };

  return {
    type: generateCardWithDensity(grid.density, allGoodsTypes),
    isVisible: true,
    position,
    key: generateCardKey(position),
  };
}

export function getAbsoluteLeft(
  relativeX: RelativePosition,
  baseX: number
): number {
  return baseX + relativeX * width;
}

export function getAbsoluteTop(
  relativeY: RelativePosition,
  baseY: number
): number {
  return baseY + relativeY * height;
}

export function generateMirrorCard(
  columnIndex: number,
  card: CardItemType
): CardItemType {
  const copiedCard = cloneDeep(card);
  const {
    type,
    position: { relativeX },
  } = copiedCard;
  copiedCard.type = isUndefined(type) ? undefined : sample(allGoodsTypes);
  copiedCard.position.columnIndex = columnIndex;
  copiedCard.position.baseX = columnIndex * width;
  copiedCard.position.relativeX = (-1 * relativeX) as RelativePosition;
  copiedCard.position.left = getAbsoluteLeft(
    copiedCard.position.relativeX,
    copiedCard.position.baseX
  );
  copiedCard.position.centerX = copiedCard.position.left + width / 2;
  copiedCard.key = generateCardKey(copiedCard.position);

  return copiedCard;
}

// 生成某一层的 card list (二维数组)
export function generateRandomLayer(params: RandomLayerParams): LayerData {
  const { layerIndex, row, column } = params;
  const centerIndex = column / 2;

  const [layerRelativeX, layerRelativeY] = [
    generateRelativePosition(),
    generateRelativePosition(),
  ];

  return generateArray(row).reduce((rowCardList, _value, rowIndex) => {
    const columnCardList = generateArray(column).reduce(
      (columnCardList, _value, columnIndex) => {
        let tempCard;
        // 前半部分
        if (columnIndex < centerIndex) {
          tempCard = generateRandomCard({
            layerIndex,
            rowIndex,
            columnIndex,
            relativeX: layerRelativeX,
            relativeY: layerRelativeY,
          });
          // 处理中间卡片
          if (columnIndex === Math.floor(centerIndex)) {
            tempCard = getUpdatedCenterCard(
              columnCardList[columnIndex - 1],
              tempCard
            );
          }
        } else {
          const preIndex = column - 1 - columnIndex;
          const preCard = columnCardList[preIndex];
          tempCard = generateMirrorCard(columnIndex, preCard);
        }
        columnCardList.push(tempCard);

        return columnCardList;
      },
      [] as CardItemType[]
    );
    rowCardList.push(columnCardList);
    return rowCardList;
  }, [] as LayerData);
}

// 生成多层 card list
export function generateRandomLayerList(
  params: RandomLayerListParams
): LayerData[] {
  const { layer, ...restParams } = params;
  return generateArray(layer).map((_value, layerIndex) =>
    generateRandomLayer({ ...restParams, layerIndex })
  );
}

/**
 * 对于生成的多层级 card，每种类型 card 的数量可能不满足 3 的整数倍，因此需要将不符合
 * 要求的 card 隐藏
 */
export function reSortLayerList(layerList: LayerData[]): void {
  const cardListByType = groupBy(
    layerList.flat(3).filter((card) => !isEmptyCard(card.type)),
    "type"
  );
  Object.values(cardListByType).forEach((sameTypeList) => {
    const len = sameTypeList.length;
    sampleSize(sameTypeList, len % 3).forEach(
      (card) => (card.type = undefined)
    );
  });
}

export function getInitialLayerList(
  params: RandomLayerListParams
): LayerData[] {
  const layerList = generateRandomLayerList(params);
  reSortLayerList(layerList);
  collapseDetect(layerList);
  return layerList;
}

export function sanitizedCandidateList(
  candidateList: GoodsType[]
): GoodsType[] {
  const countMap = countBy(candidateList);
  return candidateList.filter((type) => !isAllowClear(countMap[type]));
}

function getDetectCardList(
  currentCard: CardItemType,
  layerList: LayerData[]
): CardItemType[] {
  const {
    key: currentKey,
    position: { layerIndex, rowIndex, columnIndex },
  } = currentCard;
  return (layerList.slice(layerIndex + 1) || [])
    .map((layer) => {
      const [rowMin, rowMax] = getArrayRange(rowIndex, layer.length);
      const [columnMin, columnMax] = getArrayRange(
        columnIndex,
        layer[0].length
      );
      return layer
        .slice(rowMin, rowMax)
        .map((rowData) => rowData.slice(columnMin, columnMax));
    })
    .flat(3)
    .filter(({ key, type }) => key !== currentKey && !isEmptyCard(type));
}

/**
 * 每个 card 卡片可见性检测
 */
export function collapseDetect(layerList: LayerData[]): void {
  layerList.flat(3).forEach((currentCard) => {
    const { type } = currentCard;
    if (isEmptyCard(type)) {
      return;
    }

    // ① 获取检测范围
    const cardList = getDetectCardList(currentCard, layerList);
    // ② 检测是否重叠
    currentCard.isVisible = cardList.every(
      (card) => !hasCollapse(currentCard.position, card.position)
    );
  });
}
