import React from "react";
import numeral from "numeral";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { rootState } from "../../redux/reducers";

import theme from "../../themes";
import { BlankCard } from "../../components/card";
import { AddressTitleTypo, CopyIconImg, UserAddressTypo, UserBalanceTypo } from "./styles";

const AccountCard = () => {
  //TODO : BALANCE
  const { address } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const balance = 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);

    enqueueSnackbar("Copied", {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

  return (
    <BlankCard bgColor={theme.colors.mainblue} height="130px" backgroundLogo={true}>
      <AddressTitleTypo>Address</AddressTitleTypo>
      <CopyIconImg onClick={copyToClipboard} />
      <UserAddressTypo>{address}</UserAddressTypo>
      <UserBalanceTypo>{`${numeral(balance).format("0,0.000")} ${"FCT"}`}</UserBalanceTypo>
    </BlankCard>
  );
};

export default React.memo(AccountCard);
