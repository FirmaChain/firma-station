import React from "react";
import { useSnackbar } from "notistack";

import theme from "themes";
import { BlankCard } from "components/card";
import { AddressTitleTypo, CopyIconImg, UserAddressTypo, DenomTitleTypo, UserBalanceTypo } from "./styles";

const AccountCard = ({ accountInfo }) => {
  const { enqueueSnackbar } = useSnackbar();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountInfo.address);

    enqueueSnackbar("Copied", {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

  return (
    <BlankCard bgColor={theme.colors.mainblue} height="168px" backgroundLogo={true}>
      <AddressTitleTypo>Address</AddressTitleTypo>
      <CopyIconImg onClick={copyToClipboard} />
      <UserAddressTypo>{accountInfo.address}</UserAddressTypo>
      <DenomTitleTypo>{accountInfo.denom}</DenomTitleTypo>
      <UserBalanceTypo>{`${accountInfo.balance} ${accountInfo.denom}`}</UserBalanceTypo>
    </BlankCard>
  );
};

export default AccountCard;
