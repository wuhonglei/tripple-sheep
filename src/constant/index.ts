import fire from "../assets/image/fire.png";
import glove from "../assets/image/glove.png";
import milk from "../assets/image/milk.png";
import sheer from "../assets/image/sheer.png";
import wood from "../assets/image/wood.png";

export const enum GoodsType {
  Fire = 1,
  Glove,
  Milk,
  Sheer,
  Wood,
}

export const allGoodsTypes = [
  GoodsType.Fire,
  GoodsType.Glove,
  GoodsType.Milk,
  GoodsType.Wood,
];

export const goodUrlByType: Record<GoodsType, string> = {
  [GoodsType.Fire]: fire,
  [GoodsType.Glove]: glove,
  [GoodsType.Milk]: milk,
  [GoodsType.Sheer]: sheer,
  [GoodsType.Wood]: wood,
};

export const grid = {
  layer: 1,
  row: 6,
  column: 7,
};

export const size = {
  width: 44,
  height: 46,
};

export const allRelativePositions = [0, 0.5, -0.5] as const;
