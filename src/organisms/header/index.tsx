import React from "react";
import { useMediaQuery } from "react-responsive";

import HeaderDeskTop from "./desktop";
import HeaderMobile from "./mobile";

function Header() {
  const isMobile = useMediaQuery({ query: "(min-width:0px) and (max-width:599px)" });

  if (isMobile) {
    return <HeaderMobile />;
  } else {
    return <HeaderDeskTop />;
  }
}

export default React.memo(Header);
