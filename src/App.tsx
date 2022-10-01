import React, { useMemo, useRef, useState } from "react";

import { Modal } from "antd";
import MusicBackground from "./components/MusicBackground";
import SlotCandidate from "./components/SlotCandidate";
import MainGrid from "./components/MainGrid";
import AssistGrid from "./components/AssistGrid";

import { GoodsType, grid } from "./constant";
import { AssistCard, CardItemType, LayerData } from "./interface";

import produce from "immer";
import {
  collapseDetect,
  getInitialCardList,
  isGameOver,
  isGameSuccess,
  sanitizedCandidateList,
} from "./utils";

import "antd/dist/antd.css";
import styles from "./app.module.css";
import { cloneDeep } from "lodash-es";

function App(): JSX.Element {
  const [initialLayerList, initialAssistCard] = useMemo(
    () => getInitialCardList(grid),
    []
  );

  // 三维数组
  const [layerList, setLayerList] = useState<LayerData[]>(initialLayerList);
  const [assistCardList, setAssistCardList] =
    useState<AssistCard>(initialAssistCard);
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

    updateCandidateList(type, newLayerList, assistCardList);
  }

  function updateCandidateList(
    type: GoodsType | undefined,
    layerList: LayerData[],
    assistCardList: AssistCard
  ): void {
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
    } else if (isGameSuccess(layerList, assistCardList)) {
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

  function handleAssistClick(direction: keyof AssistCard): void {
    let type;
    const newAssistCardList = produce(assistCardList, (draftAssistCardList) => {
      type = draftAssistCardList[direction].pop();
    });
    setAssistCardList(newAssistCardList);
    updateCandidateList(type, layerList, newAssistCardList);
  }

  console.info("layerList-3", layerList);

  return (
    <MusicBackground className={styles.container}>
      <div className="flex flex-col gap-4">
        <MainGrid
          layerList={layerList}
          onClick={handleClick}
          className="flex-1 h-0"
        />
        <AssistGrid data={assistCardList} onClick={handleAssistClick} />
      </div>
      <SlotCandidate data={candidateList} />
    </MusicBackground>
  );
}

export default App;
