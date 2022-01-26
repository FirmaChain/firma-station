import React from "react";

import theme from "../../themes";
import { DownloadWrapper, DownloadItem, DownloadItemIcon, DownloadItemTypo } from "./styles";
import { DOWNLOAD_LINK_LIST } from "../../config";

const DownloadList = () => {
  const openLink = (url: string) => {
    window.open(url);
  };

  return (
    <DownloadWrapper>
      <DownloadItem onClick={() => openLink(DOWNLOAD_LINK_LIST[0])}>
        <DownloadItemIcon icon={theme.urls.win} />
        <DownloadItemTypo>Window</DownloadItemTypo>
      </DownloadItem>
      <DownloadItem onClick={() => openLink(DOWNLOAD_LINK_LIST[1])}>
        <DownloadItemIcon icon={theme.urls.linux} />
        <DownloadItemTypo>Ubuntu</DownloadItemTypo>
      </DownloadItem>
      <DownloadItem onClick={() => openLink(DOWNLOAD_LINK_LIST[2])}>
        <DownloadItemIcon icon={theme.urls.mac} />
        <DownloadItemTypo>Mac Intel</DownloadItemTypo>
      </DownloadItem>
      <DownloadItem onClick={() => openLink(DOWNLOAD_LINK_LIST[3])}>
        <DownloadItemIcon icon={theme.urls.mac} />
        <DownloadItemTypo>Mac M1</DownloadItemTypo>
      </DownloadItem>
    </DownloadWrapper>
  );
};

export default React.memo(DownloadList);
