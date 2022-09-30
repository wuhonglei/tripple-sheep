import { ReactNode, useEffect } from "react";

import musicBg from "../../assets/music/music_bg.mp3";

import styles from "./index.module.css";
import classNames from "classnames";

export interface Props {
  children?: ReactNode;
  className?: string;
}

export default function MusicBackground(props: Props): JSX.Element {
  const { children, className: outerClassName } = props;

  useEffect(() => {
    const music = new Audio(musicBg);
    music.play();
  }, []);

  return (
    <div className={classNames(styles.container, outerClassName)}>
      {children}
    </div>
  );
}
