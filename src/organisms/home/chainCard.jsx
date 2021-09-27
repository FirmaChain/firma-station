import React from "react";

import { SingleTitleCard } from "../../components/card";

function ChainCard({ chainData }) {
  return (
    <>
      {chainData.map(({ title, content, bgColor }, index) => {
        return <SingleTitleCard title={title} content={content} background={bgColor} key={index} height="100%" />;
      })}
    </>
  );
}

export default ChainCard;
