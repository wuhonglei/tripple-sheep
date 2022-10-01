import React from "react";

import CardItem from "../CardItem";

import { AssistCard } from "../../interface";

import styles from "./index.module.css";

export interface Props {
  data: AssistCard;
  onClick: (direction: keyof AssistCard) => void;
}

export default function AssistGrid(props: Props) {
  const {
    onClick,
    data: { left, center, right },
  } = props;
  return (
    <section className={styles.container}>
      {/* left */}
      <div className={styles.left}>
        {left.map((cardType, index) => (
          <CardItem
            key={index}
            type={cardType}
            style={{ left: 3 * index }}
            onClick={() => onClick("left")}
            className={styles["left-card-item"]}
            isVisible={index === left.length - 1}
          />
        ))}
      </div>
      {/* center */}
      <div className={styles.center}>
        {center.map((cardType, index) => (
          <CardItem
            key={index}
            type={cardType}
            style={{ top: 3 * index }}
            onClick={() => onClick("center")}
            className={styles["center-card-item"]}
            isVisible={index === center.length - 1}
          />
        ))}
      </div>
      {/* right */}
      <div className={styles.right}>
        {right.map((cardType, index) => (
          <CardItem
            key={index}
            type={cardType}
            style={{ right: 2 * index }}
            onClick={() => onClick("right")}
            className={styles["right-card-item"]}
            isVisible={index === right.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
