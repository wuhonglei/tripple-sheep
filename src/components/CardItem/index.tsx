import React, { CSSProperties } from "react";

import { GoodsType, goodUrlByType } from "../../constant";

import styles from "./index.module.css";
import classNames from "classnames";

export interface Props {
  title?: string;
  onClick?: () => void;
  isVisible?: boolean;
  type: GoodsType | undefined;
  style?: CSSProperties;
  className?: string;
}

export default function CardItem(props: Props): JSX.Element {
  const {
    title,
    type,
    isVisible = true,
    onClick,
    style,
    className: outerClassName,
  } = props;
  if (!type) {
    return <></>;
  }

  return (
    <div
      title={title}
      style={style}
      className={classNames(styles.container, outerClassName)}
    >
      <div
        onClick={onClick}
        className={classNames(styles.card, {
          [styles["card-mask"]]: !isVisible,
          [styles.invisible]: !isVisible,
        })}
      >
        <img
          alt={`goods-${type}`}
          className={styles.img}
          src={goodUrlByType[type]}
        />
      </div>
    </div>
  );
}
