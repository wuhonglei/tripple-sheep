import { ReactNode, useRef } from "react";

import musicBg from "../../assets/music/music_bg.mp3";

import styles from "./index.module.css";
import classNames from "classnames";

export interface Props {
  children?: ReactNode;
  className?: string;
}

export default function MusicBackground(props: Props): JSX.Element {
  const { children, className: outerClassName } = props;
  const musicRef = useRef<HTMLAudioElement>();

  return (
    <>
      <div
        className={classNames(styles.container, outerClassName)}
        onClick={() => musicRef.current?.play()}
      >
        {children}
      </div>
      <audio
        loop
        autoPlay
        controls
        ref={musicRef as any}
        className={styles.audio}
      >
        <source src={musicBg} type="audio/wav" />
      </audio>
    </>
  );
}
