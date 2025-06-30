import React from 'react';

import { FooterContainer, FooterTypo } from './styles';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterTypo>ⓒ FIRMACHAIN Pte. Ltd. All Right Reserved. </FooterTypo>
      {import.meta.env.VITE_APP_VERSION && <FooterTypo>v{import.meta.env.VITE_APP_VERSION}</FooterTypo>}
    </FooterContainer>
  );
};

export default React.memo(Footer);
