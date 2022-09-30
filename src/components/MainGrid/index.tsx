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
        {layerList.map((layer, zIndex) =>
          layer
            .flat()
            .map((data, index) => (
              <CardItem
                type={data.type}
                className={styles.card}
                key={`${zIndex}/${index}`}
                onClick={() => onClick(data)}
                style={{ zIndex, ...pick(data.position, ["left", "top"]) }}
              />
            ))
        )}
      </section>
    </main>
  );
}
