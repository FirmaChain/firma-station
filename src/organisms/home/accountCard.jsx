import React from "react";

import theme from "themes";
import { BlankCard } from "components/card";
import { AddressTitleTypo, CopyIconImg, UserAddressTypo, DenomTitleTypo, UserBalanceTypo } from "./styles";

function AccountCard({ userInfo }) {
  return (
    <BlankCard bgColor={theme.colors.mainblue} height="168px" backgroundLogo={true}>
      <AddressTitleTypo>Address</AddressTitleTypo>
      <CopyIconImg />
      <UserAddressTypo>{userInfo.address}</UserAddressTypo>
      <DenomTitleTypo>{userInfo.denom}</DenomTitleTypo>
      <UserBalanceTypo>{`${userInfo.balance} ${userInfo.denom}`}</UserBalanceTypo>
    </BlankCard>
  );
}

export default AccountCard;
