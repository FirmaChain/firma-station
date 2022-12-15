import React from 'react';
import { isMobile } from 'react-device-detect';

import theme from '../../themes';
import {
  DownloadWrapper,
  DownloadItem,
  DownloadItemIcon,
  DownloadItemIconMobile,
  DownloadItemTypo,
  DownloadContainer,
  DownloadCard,
  DownloadTitle,
} from './styles';
import { CHAIN_CONFIG } from '../../config';

const DownloadList = () => {
  const openLink = (url: string) => {
    window.open(url);
  };

  return (
    <DownloadContainer>
      {!isMobile && (
        <DownloadCard>
          <DownloadTitle>Desktop App</DownloadTitle>
          <DownloadWrapper>
            <DownloadItem onClick={() => openLink(CHAIN_CONFIG.DOWNLOAD_LINK_LIST[0])}>
              <DownloadItemIcon icon={theme.urls.win} />
              <DownloadItemTypo>Window</DownloadItemTypo>
            </DownloadItem>
            <DownloadItem onClick={() => openLink(CHAIN_CONFIG.DOWNLOAD_LINK_LIST[1])}>
              <DownloadItemIcon icon={theme.urls.linux} />
              <DownloadItemTypo>Linux</DownloadItemTypo>
            </DownloadItem>
            <DownloadItem onClick={() => openLink(CHAIN_CONFIG.DOWNLOAD_LINK_LIST[2])}>
              <DownloadItemIcon icon={theme.urls.mac} />
              <DownloadItemTypo>Mac OS (Intel)</DownloadItemTypo>
            </DownloadItem>
            <DownloadItem onClick={() => openLink(CHAIN_CONFIG.DOWNLOAD_LINK_LIST[3])}>
              <DownloadItemIcon icon={theme.urls.mac} />
              <DownloadItemTypo>Mac OS (M1)</DownloadItemTypo>
            </DownloadItem>
          </DownloadWrapper>
        </DownloadCard>
      )}

      <DownloadCard>
        <DownloadTitle>Mobile App</DownloadTitle>
        <DownloadWrapper>
          <DownloadItem onClick={() => openLink(CHAIN_CONFIG.DOWNLOAD_LINK_LIST[4])}>
            <DownloadItemIconMobile icon={theme.urls.apple} />
          </DownloadItem>
          <DownloadItem onClick={() => openLink(CHAIN_CONFIG.DOWNLOAD_LINK_LIST[5])}>
            <DownloadItemIconMobile icon={theme.urls.google} />
          </DownloadItem>
        </DownloadWrapper>
      </DownloadCard>
    </DownloadContainer>
  );
};

export default React.memo(DownloadList);
