import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import theme from "../../theme";

function SingleTitleCard({ title, content, bgColor, height = "auto" }) {
  const useStyles = makeStyles({
    root: {
      height: height,
      flex: 1,
      border: 0,
    },
    content: {
      height: "calc(" + height + ")",
      diaply: "inline-block",
      color: theme.colors.defaultWhite,
      background: bgColor,
      padding: "0 0",
      "&:last-child": {
        paddingBottom: "0",
      },
      paddingLeft: "35px",
    },
    title: {
      color: "#aaa",
      fontSize: 14,
      paddingTop: "30px",
      marginBottom: "5px",
    },
  });

  const classes = useStyles();

  return (
    <Card className={classes.root} elevation={0}>
      <CardContent className={classes.content}>
        <Typography className={classes.title} color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h4" component="h4">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SingleTitleCard;
