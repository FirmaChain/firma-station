import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

import theme from "../../theme";

const LogoBG = styled.div`
  width: 260px;
  height: 260px;
  position: absolute;
  top: -60px;
  right: -110px;
  background-image: url("/images/white_logo.svg");
  background-repeat: no-repeat;
  background-size: contain;
  bakcground-position: center center;
  opacity: 0.07;
`;

function BlankCard({
  bgColor,
  flex,
  height = "auto",
  scroll = false,
  opacity = false,
  display = "block",
  children,
  background = false,
}) {
  const useStyles = makeStyles({
    root: {
      flex,
      width: "100%",
      opacity: opacity ? 0.95 : 1,
      display: display,
      position: "relative",
      height,
      minHeight: height,
      maxHeight: height,
      overflowY: scroll ? "scroll" : "",
      boxShadow: "none",
      "& *": {
        boxShadow: "none",
      },
    },
    content: {
      height: "calc(100% - 30px)",
      color: theme.colors.defaultWhite,
      background: bgColor,
      padding: "15px",
      "&:last-child": {
        paddingBottom: "15px",
      },
    },
    title: {
      color: theme.colors.defaultGray,
      fontSize: 14,
      marginBottom: "5px",
    },
  });

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>{children}</CardContent>
      {background && <LogoBG />}
    </Card>
  );
}

export default BlankCard;
