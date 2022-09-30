import { GoodsType, size } from "../constant";
import {
  CardItemType,
  LayerData,
  RandomCardParams,
  RandomLayerListParams,
  RandomLayerParams,
} from "../interface";
import { countBy, sample } from "lodash-es";

export function generateArray(len: number): Array<number> {
  return new Array(len).fill(0);
}

export function generateRandomCard(params: RandomCardParams): CardItemType {
  const { layerIndex, rowIndex, columnIndex } = params;
  const { width, height } = size;
  return {
    type: sample([
      undefined,
      GoodsType.Fire,
      undefined,
      GoodsType.Glove,
      undefined,
      GoodsType.Milk,
      undefined,
      GoodsType.Sheer,
      undefined,
      GoodsType.Wood,
      undefined,
    ]),
    isVisible: true,
    position: {
      layerIndex,
      rowIndex,
      columnIndex,

      // 基准坐标
      baseX: columnIndex * width,
      baseY: rowIndex * height,

      // 相对基准的偏移量
      relativeX: 0,
      relativeY: 0,

      // 相对父容器的绝对坐标
      left: columnIndex * width,
      top: rowIndex * height,
    },
  };
}

export function generateRandomLayer(
  params: RandomLayerParams
): CardItemType[][] {
  const { layerIndex, row, column } = params;
  return generateArray(row).map((_value, rowIndex) =>
    generateArray(column).map((_value, columnIndex) =>
      generateRandomCard({ layerIndex, rowIndex, columnIndex })
    )
  );
}

export function generateRandomLayerList(
  params: RandomLayerListParams
): LayerData[] {
  const { layer, ...restParams } = params;
  return generateArray(layer).map((_value, layerIndex) =>
    generateRandomLayer({ ...restParams, layerIndex })
  );
}

// 某类型物品数量是否允许消除
export function isAllowClear(count: number): boolean {
  return count >= 3;
}

export function isGameOver(count: number): boolean {
  return count >= 7;
}

export function sanitizedCandidateList(
  candidateList: GoodsType[]
): GoodsType[] {
  const countMap = countBy(candidateList);
  return candidateList.filter((type) => !isAllowClear(countMap[type]));
}
