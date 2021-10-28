import React, { useEffect, useState } from "react";

import { IBlockState } from "./hooks";

import theme from "../../themes";
import { SingleTitleCard } from "../../components/card";

interface IProps {
  blockState: IBlockState;
}

const BlockCard = ({ blockState }: IProps) => {
  const blockLabelData = [
    { title: "Latest Block", bgColor: theme.colors.backgroundSideBar },
    { title: "Transactions", bgColor: theme.colors.backgroundSideBar },
    { title: "Inflation", bgColor: theme.colors.backgroundSideBar },
  ];
  const [dashboradData, setBlockData] = useState([0, 0, "0"]);

  useEffect(() => {
    setBlockData([blockState.height, blockState.transactions, blockState.inflation]);
  }, [blockState]);

  return (
    <>
      {blockLabelData.map(({ title, bgColor }, index) => (
        <SingleTitleCard title={title} content={dashboradData[index]} background={bgColor} key={index} height="100%" />
      ))}
    </>
  );
};

export default React.memo(BlockCard);
