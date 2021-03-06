import React from "react";

import { FooterContainer, FooterTypo } from "./styles";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterTypo>Copyright ⓒ 2022 FirmaChain</FooterTypo>
      <FooterTypo>v1.0.5</FooterTypo>
    </FooterContainer>
  );
};

export default React.memo(Footer);
