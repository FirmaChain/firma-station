import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { convertNumber, convertNumberFormat } from "../../utils/common";
import { rootState } from "../../redux/reducers";

import theme from "../../themes";
import { BlankCard } from "../../components/card";
import { AddressTitleTypo, UsdTypo, UserBalanceTypo, PriceTypo } from "./styles";

const AccountCard = () => {
  const { balance } = useSelector((state: rootState) => state.user);
  const [currentUSDPrice, setPrice] = useState(0);

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/simple/price?ids=upbit,firmachain&vs_currencies=usd`)
      .then((res) => {
        setPrice(Math.round(res.data.firmachain.usd * 100) / 100);
      })
      .catch((e) => {});
  }, []);

  return (
    <BlankCard bgColor={theme.colors.mainblue} height="130px" backgroundLogo={true}>
      <AddressTitleTypo>FCT Balance</AddressTitleTypo>
      <UsdTypo>1 FCT ($ {currentUSDPrice})</UsdTypo>
      <PriceTypo>$ {convertNumberFormat(currentUSDPrice * convertNumber(balance), 2)}</PriceTypo>
      <UserBalanceTypo>{`${convertNumberFormat(balance, 3)} FCT`}</UserBalanceTypo>
    </BlankCard>
  );
};

export default React.memo(AccountCard);
