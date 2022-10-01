import React, { useState } from "react";

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

  function handleClick(data: CardItemType): void {
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

    // 计算是否可消除
    let newCandidateList = produce(candidateList, (draftCandidateList) => {
      type && draftCandidateList.push(type);
    });
    setCandidateList(newCandidateList);
    newCandidateList = sanitizedCandidateList(newCandidateList);
    setTimeout(() => {
      if (isGameOver(newCandidateList.length)) {
        return Modal.warning({
          content: "游戏结束",
          onOk: () => window.location.reload(),
        });
      } else if (isGameSuccess(layerList.length)) {
        return Modal.success({
          content: "闯关成功",
          onOk: () => window.location.reload(),
        });
      }
      setCandidateList(newCandidateList);
    }, 300);
  }

  console.info("layerList-1", layerList);

  return (
    <MusicBackground className={styles.container}>
      <MainGrid layerList={layerList} onClick={handleClick} />
      <SlotCandidate data={candidateList} />
    </MusicBackground>
  );
}

export default App;
