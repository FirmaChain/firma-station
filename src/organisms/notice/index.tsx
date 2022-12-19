import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { NOTICE_JSON_URI } from '../../config';

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

const Notice = ({ onLoaded }: { onLoaded: (isShow: boolean) => void }) => {
  const [maintenance, setMaintenance] = useState<{
    isShow: boolean;
    title: string;
    content: string;
    link: string;
  } | null>(null);

  useEffect(() => {
    axios
      .get(NOTICE_JSON_URI)
      .then(({ data }) => {
        const { isShow, title, content, link } = data.maintenance;
        setMaintenance({ isShow, title, content, link });
        onLoaded && onLoaded(isShow);
      })
      .catch((error) => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {maintenance && (
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
      )}
    </>
  );
};

export default React.memo(Notice);
