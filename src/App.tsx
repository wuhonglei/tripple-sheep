import React, { useRef, useState } from "react";

import { Modal } from "antd";
import MusicBackground from "./components/MusicBackground";
import SlotCandidate from "./components/SlotCandidate";
import MainGrid from "./components/MainGrid";

import { GoodsType, grid } from "./constant";
import { CardItemType, LayerData } from "./interface";

import produce from "immer";
import {
  collapseDetect,
  getInitialLayerList,
  isGameOver,
  isGameSuccess,
  sanitizedCandidateList,
} from "./utils";

import "antd/dist/antd.css";
import styles from "./app.module.css";
import { cloneDeep } from "lodash-es";

function App(): JSX.Element {
  // 三维数组
  const [layerList, setLayerList] = useState<LayerData[]>(() =>
    getInitialLayerList(grid)
  );
  const [candidateList, setCandidateList] = useState<GoodsType[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const newlyCandidateList = useRef<GoodsType[]>(candidateList);

  function handleClick(data: CardItemType): void {
    window.clearTimeout(timerRef.current);

    const {
      type,
      position: { layerIndex, rowIndex, columnIndex },
    } = data;

    const newLayerList = cloneDeep(layerList);
    newLayerList[layerIndex][rowIndex][columnIndex] = {
      ...data,
      type: undefined,
      isVisible: false,
    };
    collapseDetect(newLayerList);
    setLayerList(newLayerList);

    let newCandidateList = produce(
      newlyCandidateList.current,
      (draftCandidateList) => {
        type && draftCandidateList.push(type);
      }
    );
    // 计算是否可消除
    setCandidateList(newCandidateList);
    newlyCandidateList.current = sanitizedCandidateList(newCandidateList);

    if (isGameOver(newlyCandidateList.current.length)) {
      Modal.warning({
        content: "游戏结束",
        onOk: () => window.location.reload(),
      });
      return;
    } else if (isGameSuccess(layerList.length)) {
      Modal.success({
        content: "闯关成功",
        onOk: () => window.location.reload(),
      });
      return;
    }

    timerRef.current = setTimeout(() => {
      setCandidateList(newlyCandidateList.current);
    }, 300);
  }

  console.info("layerList-3", layerList);

  return (
    <MusicBackground className={styles.container}>
      <MainGrid layerList={layerList} onClick={handleClick} />
      <SlotCandidate data={candidateList} />
    </MusicBackground>
  );
}

export default App;
