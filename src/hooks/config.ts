import React from "react";
import { BigNumber, ethers } from "ethers";
import {
  IDOCONTRACT_ABI,
  IDOCONTRACT_ADDR
} from "../config/abi";
import { standardTokenABI } from "../config/standardToken";
import { HomeDataProps } from "./home";

declare const window: Window & { ethereum: any };

export interface Lineg {
  name?: string;
  symbol?: string;
  decimals?: string;
  balanceOf?: string;
}

const connecteState = () => {
  const connecteState = localStorage.getItem("wagmi.connected");
  if (connecteState !== null && connecteState !== undefined) {
    return Boolean(connecteState);
  } else {
    return false;
  }
};

const InstancedContract = (contractAddr: any, contractABI: any) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const Contract = new ethers.Contract(contractAddr, contractABI, signer);
  return Contract;
};

const ObtainAddress = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await signer.getBalance();
    return {
      address,
      balance,
    };
  } else {
    return;
  }
};

const Token0InputValueOnChange = async (value: string, data: HomeDataProps) => {
  const idoContract = InstancedContract(IDOCONTRACT_ADDR, IDOCONTRACT_ABI);
  const amountIn = ethers.utils.parseEther(value);
  let amountOut = BigNumber.from(0);
  let distributionPercentageCal;
  const VestingManagersCount = data.VestingManagersCount;
  const decimalsCal = BigNumber.from(10).pow(data.PreTokenDec);
  const priceCal = BigNumber.from(data.Price);
  const PERCENTAGE_DENOM_CAL = BigNumber.from(10000);
  for (let index = 0; index < Number(VestingManagersCount); index++) {
    const vestingManagers = await idoContract.getVestingManager(index);
    distributionPercentageCal = BigNumber.from(vestingManagers[1].toString());
    const amountBusdInByVestingManager: BigNumber = amountIn.mul(distributionPercentageCal).div(PERCENTAGE_DENOM_CAL);
    amountOut = amountBusdInByVestingManager.mul(decimalsCal).div(priceCal);
  }
  return {
    amountOut: ethers.utils.formatUnits(amountOut, data.PreTokenDec)
  }
};

const allowance = async (tokenAddress: string, lockAddress: string) => {
  const { address } = await ObtainAddress() as any;
  const allowance = await (InstancedContract(tokenAddress, standardTokenABI) as any).allowance(
    address,
    lockAddress
  );
  return allowance;
};

const FormatUnitsConver = (amount: any, decimals: any) => {
  const FormatUnitsValue = ethers.utils.formatUnits(amount, decimals);
  return FormatUnitsValue;
};

export {
  InstancedContract,
  ObtainAddress,
  connecteState,
  Token0InputValueOnChange,
  allowance,
  FormatUnitsConver
};
