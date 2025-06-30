import React from 'react';

import { FooterContainer, FooterTypo } from './styles';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterTypo>ⓒ FIRMACHAIN Pte. Ltd. All Right Reserved. </FooterTypo>
      {process.env.APP_VERSION && <FooterTypo>v{process.env.APP_VERSION}</FooterTypo>}
    </FooterContainer>
  );
};

export default React.memo(Footer);
