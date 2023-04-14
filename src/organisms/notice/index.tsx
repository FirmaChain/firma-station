import React from 'react';
import { isMobile } from 'react-device-detect';

import {
  NoticeContainer,
  NoticeWrapper,
  LogoImg,
  TitleTypo,
  SubTitleTypo,
  LinkWrapper,
  LinkIcon,
  Copyright,
  Contact,
  BackgroundSymbol,
} from './styles';

const Notice = ({
  maintenance,
}: {
  maintenance: {
    isShow: boolean;
    title: string;
    content: string;
    link: string;
  } | null;
}) => {
  return (
    maintenance && (
      <NoticeContainer>
        {isMobile === false && <BackgroundSymbol />}

        <NoticeWrapper>
          <LogoImg />

          <TitleTypo>{maintenance.title}</TitleTypo>
          <SubTitleTypo>{maintenance.content}</SubTitleTypo>
          <LinkWrapper onClick={() => window.open(maintenance.link)}>
            Show more details
            <LinkIcon />
          </LinkWrapper>
          <Copyright>Copyrightⓒ FirmaChain Pte. Ltd. | All Right Reserved</Copyright>
          <Contact>contact@firmachain.org</Contact>
        </NoticeWrapper>
      </NoticeContainer>
    )
  );
};

export default React.memo(Notice);
