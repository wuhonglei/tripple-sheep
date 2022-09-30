import React from "react";

import CardItem from "../CardItem";

import styles from "./index.module.css";
import classNames from "classnames";
import { GoodsType } from "../../constant";

export interface Props {
  data: GoodsType[];
  className?: string;
}

export default function SlotCandidate(props: Props): JSX.Element {
  const { data, className: outerClassName } = props;
  return (
    <div className={classNames(styles.container, outerClassName)}>
      {data.map((type, index) => (
        <CardItem key={index} type={type} />
      ))}
    </div>
  );
}
