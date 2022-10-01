import React from "react";
import { CardItemType, LayerData } from "../../interface";
import CardItem from "../CardItem";

import styles from "./index.module.css";
import classNames from "classnames";

export interface Props {
  layerList: LayerData[];
  onClick: (data: CardItemType) => void;
  className?: string;
}

export default function MainGrid(props: Props) {
  const { onClick, layerList, className: outerClassName } = props;
  return (
    <main className={classNames(styles.container, outerClassName)}>
      <section className={styles.layer}>
        {layerList.map((layer) =>
          layer.flat().map((data) => {
            const {
              key,
              isVisible,
              position: { layerIndex, left, top, relativeX, relativeY },
            } = data;

            return (
              <CardItem
                key={key}
                type={data.type}
                isVisible={isVisible}
                className={styles.card}
                onClick={() => onClick(data)}
                title={`${key}:${relativeX}/${relativeY}`}
                style={{ zIndex: layerIndex, left, top }}
              />
            );
          })
        )}
      </section>
    </main>
  );
}
