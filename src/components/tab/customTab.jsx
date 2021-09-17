import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";

import theme from "../../theme";

function CustomTabs() {
  const useStyles = makeStyles({
    root: {
      marginBottom: "10px",
      flexGrow: 1,
      backgroundColor: theme.colors.backgroundSideBar,
      "& *": {
        color: "#aaa",
      },
    },
  });

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.root} elevation={0}>
      <Tabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { background: theme.colors.purple2 } }}>
        <Tab label="History" />
        <Tab label="Send" />
      </Tabs>
    </Paper>
  );
}

export default CustomTabs;
