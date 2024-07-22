import React from 'react';

import { FooterContainer, FooterTypo } from './styles';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterTypo>ⓒ FIRMACHAIN Pte. Ltd. All Right Reserved. </FooterTypo>
      <FooterTypo>v1.1.0</FooterTypo>
    </FooterContainer>
  );
};

export default React.memo(Footer);
