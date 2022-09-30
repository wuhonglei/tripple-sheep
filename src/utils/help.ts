import { allRelativePositions, GoodsType } from "../constant";
import { RelativePosition } from "../interface";

import { sample } from "lodash-es";

export function isEmptyCard(type: GoodsType | undefined): type is undefined {
  return type === undefined;
}

export function isEmptyOffset(offset: RelativePosition): boolean {
  return offset === 0;
}

export function generateArray(len: number): Array<number> {
  return new Array(len).fill(0);
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
