import fire from "../assets/image/fire.png";
import glove from "../assets/image/glove.png";
import milk from "../assets/image/milk.png";
import sheer from "../assets/image/sheer.png";
import wood from "../assets/image/wood.png";
import cabbage from "../assets/image/cabbage.png";
import corn from "../assets/image/corn.png";
import fork from "../assets/image/fork.png";
import redString from "../assets/image/red_string.png";
import whiteString from "../assets/image/white_string.png";

export const enum GoodsType {
  Fire = 1,
  Glove,
  Milk,
  Sheer,
  Wood,
  Cabbage,
  Corn,
  Fork,
  RedString,
  WhiteString,
}

export const allGoodsTypes: GoodsType[] = [
  GoodsType.Fire,
  GoodsType.Glove,
  GoodsType.Milk,
  GoodsType.Wood,
  GoodsType.Cabbage,
  GoodsType.Corn,
  GoodsType.Fork,
  GoodsType.RedString,
  GoodsType.WhiteString,
];

export const goodUrlByType: Record<GoodsType, string> = {
  [GoodsType.Fire]: fire,
  [GoodsType.Glove]: glove,
  [GoodsType.Milk]: milk,
  [GoodsType.Sheer]: sheer,
  [GoodsType.Wood]: wood,
  [GoodsType.Cabbage]: cabbage,
  [GoodsType.Corn]: corn,
  [GoodsType.Fork]: fork,
  [GoodsType.RedString]: redString,
  [GoodsType.WhiteString]: whiteString,
};

export const grid = {
  density: 0.5,
  layer: 3,
  row: 6,
  column: 7,
};

export const size = {
  width: 44,
  height: 46,
};

export const allRelativePositions = [0, 0.5, -0.5] as const;
