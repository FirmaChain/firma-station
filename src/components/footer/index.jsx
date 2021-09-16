import React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import styled from "styled-components";

const FooterContainer = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  line-height: 50px;
  padding: 0 40px;
  margin-top: auto;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: #707070;
`;

function Footer() {
  const useStyles = makeStyles(() => ({
    footerText: {
      fontWeight: "300",
      height: "50px",
      lineHeight: "50px",
    },
  }));

  const classes = useStyles();

  return (
    <FooterContainer>
      <Typography variant="subtitle2" className={classes.footerText}>
        Copyright ⓒ 2021 FirmaChain
      </Typography>
      <Typography variant="subtitle2" className={classes.footerText}>
        v0.0.1
      </Typography>
    </FooterContainer>
  );
}

export default Footer;
