import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { convertNumber, convertNumberFormat } from '../../utils/common';
import { rootState } from '../../redux/reducers';

import theme from '../../themes';
import { CHAIN_CONFIG } from '../../config';
import { BlankCard } from '../../components/card';
import { AddressTitleTypo, UsdTypo, UserBalanceTypo, PriceTypo } from './styles';

const AccountCard = () => {
  const { balance } = useSelector((state: rootState) => state.user);
  const [currentUSDPrice, setPrice] = useState(0.0);

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/simple/price?ids=upbit,firmachain&vs_currencies=usd`)
      .then((res) => {
        setPrice(res.data.firmachain.usd);
      })
      .catch((e) => {});
  }, []);

  return (
    <BlankCard bgColor={theme.colors.mainblue} height='130px' backgroundLogo={true}>
      <AddressTitleTypo>{CHAIN_CONFIG.PARAMS.SYMBOL} Balance</AddressTitleTypo>
      <UsdTypo>
        1 {CHAIN_CONFIG.PARAMS.SYMBOL} ($ {Math.round(currentUSDPrice * 1000) / 1000})
      </UsdTypo>
      <PriceTypo>$ {convertNumberFormat(currentUSDPrice * convertNumber(balance), 2)}</PriceTypo>
      <UserBalanceTypo>{`${convertNumberFormat(balance, 3)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</UserBalanceTypo>
    </BlankCard>
  );
};

export default React.memo(AccountCard);
