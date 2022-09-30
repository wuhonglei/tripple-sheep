import React, { useState } from "react";

import { Modal } from "antd";
import MusicBackground from "./components/MusicBackground";
import SlotCandidate from "./components/SlotCandidate";
import MainGrid from "./components/MainGrid";

import { GoodsType, grid } from "./constant";
import { CardItemType, LayerData } from "./interface";

import produce from "immer";
import {
  generateRandomLayerList,
  isGameOver,
  sanitizedCandidateList,
} from "./utils";

import "antd/dist/antd.css";
import styles from "./app.module.css";

function App(): JSX.Element {
  // 三维数组
  const [layerList, setLayerList] = useState<LayerData[]>(() =>
    generateRandomLayerList(grid)
  );
  const [candidateList, setCandidateList] = useState<GoodsType[]>([]);

  function handleClick(data: CardItemType): void {
    const {
      type,
      position: { layerIndex, rowIndex, columnIndex },
    } = data;

    setLayerList(
      produce(layerList, (draftLayerList) => {
        draftLayerList[layerIndex][rowIndex][columnIndex] = {
          ...data,
          type: undefined,
          isVisible: false,
        };
      })
    );

    // 计算是否可消除
    let newCandidateList = produce(candidateList, (draftCandidateList) => {
      type && draftCandidateList.push(type);
    });
    newCandidateList = sanitizedCandidateList(newCandidateList);
    if (isGameOver(newCandidateList.length)) {
      setTimeout(() => {
        Modal.warning({
          content: "游戏结束",
        });
      }, 300);
    }

    setCandidateList(newCandidateList);
  }

  return (
    <MusicBackground className={styles.container}>
      <MainGrid layerList={layerList} onClick={handleClick} />
      <SlotCandidate data={candidateList} />
    </MusicBackground>
  );
}

export default App;
