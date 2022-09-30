import { allRelativePositions, GoodsType } from "../constant";

export type RelativePosition = typeof allRelativePositions[number];

export interface CardItemType {
  type: GoodsType | undefined;
  isVisible: boolean;
  position: {
    // 在层级中的位置
    layerIndex: number;
    rowIndex: number;
    columnIndex: number;

    // 基准坐标
    baseX: number;
    baseY: number;

    // 相对基准的偏移量
    relativeX: RelativePosition;
    relativeY: RelativePosition;

    // 相对父容器的绝对坐标
    left: number;
    top: number;
  };
}

export type LayerData = CardItemType[][];

export interface RandomLayerParams {
  layerIndex: number;
  row: number;
  column: number;
}

export interface RandomLayerListParams
  extends Omit<RandomLayerParams, "layerIndex"> {
  layer: number;
}

export interface RandomCardParams {
  layerIndex: number;
  rowIndex: number;
  columnIndex: number;

  relativeX: RelativePosition;
  relativeY: RelativePosition;
}
