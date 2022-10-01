import { allRelativePositions, GoodsType, size } from "../constant";
import { CardItemType, RelativePosition } from "../interface";

import { sample } from "lodash-es";

export function isEmptyCard(type: GoodsType | undefined): type is undefined {
  return type === undefined;
}

export function isEmptyOffset(offset: RelativePosition): boolean {
  return offset === 0;
}

export function generateArray(
  len: number,
  value: any = undefined
): Array<number> {
  return new Array(len).fill(value);
}

export function generateRelativePosition(): RelativePosition {
  // 边缘节点
  return sample(allRelativePositions) as RelativePosition;
}

// 某类型物品数量是否允许消除
export function isAllowClear(count: number): boolean {
  return count >= 3;
}

export function isGameOver(count: number): boolean {
  return count >= 7;
}

export function isGameSuccess(count: number): boolean {
  return count <= 0;
}

export function getArrayRange(index: number, len: number): [number, number] {
  return [
    index <= 0 ? 0 : index - 1,
    index === len - 1 ? index + 1 : index + 2,
  ];
}

export function generateCardKey(
  params: Pick<
    CardItemType["position"],
    "layerIndex" | "rowIndex" | "columnIndex"
  >
): string {
  const { layerIndex, rowIndex, columnIndex } = params;
  return `${layerIndex}:${rowIndex}/${columnIndex}`;
}

/**
 * 相交的条件：
 * https://blog.csdn.net/iloveyin/article/details/48372799
 * 两个矩形的重心距离在X和Y轴上都小于两个矩形长或宽的一半之和
 */
export function hasCollapse(
  positionA: CardItemType["position"],
  positionB: CardItemType["position"]
): boolean {
  const { width, height } = size;
  const distanceX = Math.abs(positionA.centerX - positionB.centerX);
  const distanceY = Math.abs(positionA.centerY - positionB.centerY);

  return distanceX < width && distanceY < height;
}

export function generateCardWithDensity(
  density: number,
  itemList: any[]
): any | undefined {
  const undefinedLen =
    density === 1 ? 0 : ((1 - density) * itemList.length) / density;
  const item = sample([
    ...itemList,
    ...generateArray(Math.floor(undefinedLen), undefined),
  ]);

  return item;
}
