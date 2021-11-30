import React from "react";
import numeral from "numeral";
import { useSelector } from "react-redux";
import { convertNumber } from "../../utils/common";

import { rootState } from "../../redux/reducers";

import theme from "../../themes";
import { BlankCard } from "../../components/card";
import { AddressTitleTypo, UsdTypo, UserBalanceTypo, PriceTypo } from "./styles";

const AccountCard = () => {
  const { balance } = useSelector((state: rootState) => state.user);
  const currentUSDPrice = 0.21;

  return (
    <BlankCard bgColor={theme.colors.mainblue} height="130px" backgroundLogo={true}>
      <AddressTitleTypo>FCT Balance</AddressTitleTypo>
      <UsdTypo>1 FCT ($ {currentUSDPrice})</UsdTypo>
      <PriceTypo>$ {numeral(currentUSDPrice * convertNumber(balance)).format("0,0.00")}</PriceTypo>
      <UserBalanceTypo>{`${numeral(balance).format("0,0.000")} FCT`}</UserBalanceTypo>
    </BlankCard>
  );
};

export default React.memo(AccountCard);
