import React from "react";
import BigNumber from "bignumber.js";

export interface HomeDataProps {
  Price: string;
  PriceShow: string;
  MinAmount: string;
  MaxAmount: string;
  StartTime: string;
  Duration: string;
  TotalSold: string;
  TotalEarned: string;
  TotalBonus: string;
  PreTokenAddr: string;
  PreTokenSym: string;
  PreTokenDec: string;
  UserPreTokenBal: string;
  WhitelistIsEnable: boolean;
  UserSpentAmount: string;
  UserBoughtAmount: string;
  UserRewardsAmount: string;
  UserBonusesAmount: string;
  VestingManagersCount: string;
  IsWhitelisted: boolean;
  UserReferrer: string;
  VestingManagers: string[];
  UserVestingWallets: string[];
  TotalDistributionRatio: string;
  UserChainTokenBal: string;
  UserReferrerUrl: string;
  WalletAddr: string;
  Progress: number;
  Token0Input: string;
  Token0InputShow: string;
  Token1Output: string;
}

export const HomeInitData: HomeDataProps = {
  Price: "0",
  PriceShow: "0",
  MinAmount: "0",
  MaxAmount: "0",
  StartTime: "",
  Duration: "0",
  TotalSold: "0",
  TotalEarned: "0",
  TotalBonus: "0",
  PreTokenAddr: "0",
  PreTokenSym: "AYAT",
  PreTokenDec: "18",
  UserPreTokenBal: "",
  WhitelistIsEnable: false,
  UserSpentAmount: "0",
  UserBoughtAmount: "0",
  UserRewardsAmount: "0",
  UserBonusesAmount: "0",
  VestingManagersCount: "0",
  IsWhitelisted: false,
  UserReferrer: "",
  VestingManagers: [],
  UserVestingWallets: [],
  TotalDistributionRatio: "0",
  UserChainTokenBal: "0",
  UserReferrerUrl: "",
  WalletAddr: "",
  Progress: 0,
  Token0Input: "",
  Token0InputShow: "",
  Token1Output: "",
};

export interface VestingWalletInfo {
  VestingWalletAddr: string,
  ReleasedPreToken: string;
  ReleasablePreToken: string;
  Beneficiary: string;
  StartTime: string;
  Duration: string;
  VestedAmount: string;
}

export const VestingWalletInitState: VestingWalletInfo = {
  VestingWalletAddr: "",
  ReleasedPreToken: "0.0",
  ReleasablePreToken: "0.0",
  Beneficiary: "0.0",
  StartTime: "",
  Duration: "",
  VestedAmount: "0.0",
};

const DigitalConversion = (parameter: any, numerical: any) => {
  const DigitalValue = new BigNumber(parameter)
    .times(new BigNumber(10).pow(numerical))
    .toFixed();
  return DigitalValue;
};

export {
  DigitalConversion
}