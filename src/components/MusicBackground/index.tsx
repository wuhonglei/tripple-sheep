import { ReactNode, useEffect, useRef } from "react";

import musicBg from "../../assets/music/music_bg.mp3";

import styles from "./index.module.css";
import classNames from "classnames";

export interface Props {
  children?: ReactNode;
  className?: string;
}

export default function MusicBackground(props: Props): JSX.Element {
  const { children, className: outerClassName } = props;
  const musicRef = useRef(new Audio(musicBg));

  return (
    <div
      className={classNames(styles.container, outerClassName)}
      onClick={(): any => musicRef.current.play()}
    >
      {children}
    </div>
  );
}
