import React from "react";
import { CardItemType, LayerData } from "../../interface";
import CardItem from "../CardItem";

import { pick } from "lodash-es";
import styles from "./index.module.css";

export interface Props {
  layerList: LayerData[];
  onClick: (data: CardItemType) => void;
}

export default function MainGrid(props: Props) {
  const { onClick, layerList } = props;
  return (
    <main className={styles.container}>
      <section className={styles.layer}>
        {layerList.map((layer) =>
          layer.flat().map((data) => {
            const {
              position: {
                layerIndex,
                rowIndex,
                columnIndex,
                left,
                top,
                relativeX,
                relativeY,
              },
            } = data;
            const key = `${layerIndex}:${rowIndex}/${columnIndex}:${relativeX}/${relativeY}`;

            return (
              <CardItem
                key={key}
                title={key}
                type={data.type}
                className={styles.card}
                onClick={() => onClick(data)}
                style={{ zIndex: layerIndex, left, top }}
              />
            );
          })
        )}
      </section>
    </main>
  );
}
