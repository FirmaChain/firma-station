import React from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import theme from "themes";
import { BlankCard } from "components/card";
import { AddressTitleTypo, CopyIconImg, UserAddressTypo, UserBalanceTypo } from "./styles";

const AccountCard = () => {
  const { address, balance } = useSelector((state) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

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
      <UserBalanceTypo>{`${balance} ${"FCT"}`}</UserBalanceTypo>
    </BlankCard>
  );
};

export default AccountCard;