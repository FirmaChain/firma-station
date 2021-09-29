import React from "react";

import theme from "themes";
import { BlankCard } from "components/card";
import { AddressTitleTypo, CopyIconImg, UserAddressTypo, DenomTitleTypo, UserBalanceTypo } from "./styles";

function AccountCard({ accountInfo }) {
  return (
    <BlankCard bgColor={theme.colors.mainblue} height="168px" backgroundLogo={true}>
      <AddressTitleTypo>Address</AddressTitleTypo>
      <CopyIconImg />
      <UserAddressTypo>{accountInfo.address}</UserAddressTypo>
      <DenomTitleTypo>{accountInfo.denom}</DenomTitleTypo>
      <UserBalanceTypo>{`${accountInfo.balance} ${accountInfo.denom}`}</UserBalanceTypo>
    </BlankCard>
  );
}

export default AccountCard;
