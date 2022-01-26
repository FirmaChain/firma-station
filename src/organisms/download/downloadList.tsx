import React from "react";

import theme from "../../themes";
import { DownloadWrapper, DownloadItem, DownloadItemIcon, DownloadItemTypo } from "./styles";

const DownloadList = () => {
  const openLink = (url: string) => {
    window.open(url);
  };

  return (
    <DownloadWrapper>
      <DownloadItem
        onClick={() => openLink("https://drive.google.com/file/d/13dO4-Gq9MN9k5jensrljn4oK4a7Q-M7y/view?usp=sharing")}
      >
        <DownloadItemIcon icon={theme.urls.win} />
        <DownloadItemTypo>Window</DownloadItemTypo>
      </DownloadItem>
      <DownloadItem
        onClick={() => openLink("https://drive.google.com/file/d/1GEaYcIsPerhlSwwoTI46FnV9Jk4vk1H9/view?usp=sharing")}
      >
        <DownloadItemIcon icon={theme.urls.linux} />
        <DownloadItemTypo>Ubuntu</DownloadItemTypo>
      </DownloadItem>
      <DownloadItem
        onClick={() => openLink("https://drive.google.com/file/d/1DgVD_2X0hXbTnnxEA0tn8ABETUxpoeya/view?usp=sharing")}
      >
        <DownloadItemIcon icon={theme.urls.mac} />
        <DownloadItemTypo>Mac Intel</DownloadItemTypo>
      </DownloadItem>
      <DownloadItem
        onClick={() => openLink("https://drive.google.com/file/d/13cNRQa_S2_TXLuzi5eDK_sbc_50pIVRM/view?usp=sharing")}
      >
        <DownloadItemIcon icon={theme.urls.mac} />
        <DownloadItemTypo>Mac M1</DownloadItemTypo>
      </DownloadItem>
    </DownloadWrapper>
  );
};

export default React.memo(DownloadList);
