import React from 'react';

import theme from '../../themes';
import { CommunityWrapper, CommunityItem, CommunityItemIcon, CommunityItemTypo } from './styles';

const CommunityList = () => {
  const openLink = (url: string) => {
    window.open(url);
  };

  return (
    <CommunityWrapper>
      <CommunityItem onClick={() => openLink('https://t.me/firmachain_announcement')}>
        <CommunityItemIcon icon={theme.urls.telegram} />
        <CommunityItemTypo>Telegram</CommunityItemTypo>
      </CommunityItem>
      <CommunityItem onClick={() => openLink('https://github.com/firmachain')}>
        <CommunityItemIcon icon={theme.urls.github} />
        <CommunityItemTypo>Github</CommunityItemTypo>
      </CommunityItem>
      <CommunityItem onClick={() => openLink('https://x.com/firmachain')}>
        <CommunityItemIcon icon={theme.urls.x} />
        <CommunityItemTypo>X (Twitter)</CommunityItemTypo>
      </CommunityItem>
      <CommunityItem onClick={() => openLink('https://medium.com/firmachain')}>
        <CommunityItemIcon icon={theme.urls.medium} />
        <CommunityItemTypo>Medium</CommunityItemTypo>
      </CommunityItem>
    </CommunityWrapper>
  );
};

export default React.memo(CommunityList);
