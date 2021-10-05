import React, { useEffect, useState } from "react";

import theme from "themes";
import { SingleTitleCard } from "components/card";
import { useBlockData } from "./hooks";

const BlockCard = () => {
  const { state } = useBlockData();
  const blockLabelData = [
    { title: "Latest Block", bgColor: theme.colors.backgroundSideBar },
    { title: "Transactions", bgColor: theme.colors.backgroundSideBar },
    { title: "Inflation", bgColor: theme.colors.backgroundSideBar },
  ];
  const [dashboradData, setBlockData] = useState([0, 0, 0]);

  useEffect(() => {
    setBlockData([state.height, state.transactions, state.inflation]);
  }, [state]);

  return (
    <>
      {blockLabelData.map(({ title, bgColor }, index) => (
        <SingleTitleCard title={title} content={dashboradData[index]} background={bgColor} key={index} height="100%" />
      ))}
    </>
  );
};

export default BlockCard;