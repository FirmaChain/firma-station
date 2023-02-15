import React from 'react';

import { FooterContainer, FooterTypo } from './styles';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterTypo>Copyright ⓒ 2023 FIRMACHAIN</FooterTypo>
      <FooterTypo>v1.1.0</FooterTypo>
    </FooterContainer>
  );
};

export default React.memo(Footer);
