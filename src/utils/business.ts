import { allGoodsTypes, GoodsType, size } from "../constant";
import {
  CardItemType,
  LayerData,
  RandomCardParams,
  RandomLayerListParams,
  RandomLayerParams,
  RelativePosition,
} from "../interface";

import { countBy, sample, cloneDeep, isUndefined } from "lodash-es";
import {
  generateArray,
  generateRelativePosition,
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

  return {
    type: sample([
      ...allGoodsTypes,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]),
    isVisible: true,
    position: {
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
      left: getAbsoluteLeft(relativeX, baseX),
      top: getAbsoluteTop(relativeY, baseY),
    },
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

export function sanitizedCandidateList(
  candidateList: GoodsType[]
): GoodsType[] {
  const countMap = countBy(candidateList);
  return candidateList.filter((type) => !isAllowClear(countMap[type]));
}
