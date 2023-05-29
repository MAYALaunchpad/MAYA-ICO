import { HomeInitData, VestingWalletInfo, VestingWalletInitState, HomeDataProps } from "../../hooks/home";
import MetaMask from "../../assets/image/ico1.png";
import TrustWall from "../../assets/image/ico3.png";
import WallCont from "../../assets/image/ico5.png";
import coienARM from "../../assets/image/ico10.png";
import ico11 from "../../assets/image/ico11.png";
import icon012 from "../../assets/image/icon012.png";
import icon013 from "../../assets/image/icon013.png";
import icon014 from "../../assets/image/icon014.png";
import PresaleImage from "../../assets/image/PresaleImage.png";
import PresaleImageActive from "../../assets/image/PresaleImageActive.png";
import ExchangeImage from "../../assets/image/ExchangeImage.png";
import ExchangeImageActive from "../../assets/image/ExchangeImageActive.png";
import UserInfo from '../../assets/image/UserInfo.png'
import UserInfoActive from '../../assets/image/UserInfoActive.png'
import UserInfoLogo from '../../assets/image/UserInfoLogo.png'
import copy from "copy-to-clipboard";
import { ethers, logger } from "ethers";
import { clauseText } from "./clause";
import "./index.scss";
import {
  ArrowDownOutlined,
  RedoOutlined,
  CopyFilled
} from "@ant-design/icons";
import { message, Modal, Progress } from "antd";
import { IDOCONTRACT_ADDR, IDOCONTRACT_ABI, MANAGEDVESTINGWALLET_ABI } from "../../config/abi";
let timerGetStatus: any = 0;
import React, { memo, useEffect, useState } from "react";
import { floatformat } from "../../utils/floatFormat";
import {
  connecteState,
  InstancedContract,
  ObtainAddress,
  Token0InputValueOnChange,
  FormatUnitsConver,
} from "../../hooks/config";
import { BuyErrorHandle, BuyErrorInitState } from "../../hooks/ErrorHandle";
import { useAccount } from 'wagmi'
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { flareTestnet } from "wagmi/dist/chains";
declare const window: Window & { ethereum: any };

const Home = () => {
  const currentTime = parseInt((Number(new Date().getTime()) / 1000).toString());
  const [messageApi, contextHolder] = message.useMessage();
  const [homeData, setHomeData] = useState<HomeDataProps>(HomeInitData);
  const [userReferrer, setUserReferrer] = useState("0x0000000000000000000000000000000000000000");
  const [buyLoading, setBuyLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [userVestingWalletInfo, setUserVestingWalletInfo] = useState<VestingWalletInfo>(VestingWalletInitState);
  const [openPolicyPopup, setOpenPolicyPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>("");
  const [buttonMode, setButtonMode] = useState<number>(2);
  const [buyError, setBuyError] = useState<BuyErrorHandle>(BuyErrorInitState);
  const [isCorrectChain, setIsCorrectChain] = useState<boolean>(false);
  // const { address, isConnected } = useAccount()

  const ClosePopup = () => {
    setOpenPolicyPopup(false);
  };
  const CopyOnClick = () => {
    copy(homeData.UserReferrerUrl);
    messageApi.open({
      type: "success",
      content: "Copy Successfully !",
      duration: 3,
    });
  };
  const IsConnectGetdata = async () => {
    if (window.ethereum && connecteState()) {
      try {
        const walletInfo: any = await ObtainAddress();
        if (walletInfo.address && walletInfo.address !== "") {
          setHomeData((paveState: any) => {
            return {
              ...paveState,
              walletAddr: walletInfo.address,
              generateLink: `http://127.0.0.1:8081/?ref=${walletInfo.address}`,
            };
          });
        }
      } catch (error) {
        setHomeData((paveState: any) => {
          return {
            ...paveState,
            walletAddr: "",
            generateLink: `http://127.0.0.1:8081/?ref=${" "}`,
          };
        });
      }
    }
  };
  const CanBuy = () => {
    if (currentTime >= Number(homeData.StartTime) && currentTime <= Number(homeData.StartTime) + Number(homeData.Duration)) {
      if (homeData.WhitelistIsEnable) {
        if (!buyError.InsufficientBalError
          && !buyError.MinAmountError
          && !buyError.MaxAmountError
          && Number(homeData.TotalDistributionRatio) === 10000
          && homeData.IsWhitelisted
          && !buyError.IncorrectRefError
          && !buyError.InvalidRefError
          && Number(homeData.Token0InputShow) > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        if (!buyError.InsufficientBalError
          && !buyError.MinAmountError
          && !buyError.MaxAmountError
          && Number(homeData.TotalDistributionRatio) === 10000
          && !buyError.IncorrectRefError
          && !buyError.InvalidRefError
          && Number(homeData.Token0InputShow) > 0) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  const GetInitData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddr = await signer.getAddress();
    const IDOContract = InstancedContract(IDOCONTRACT_ADDR, IDOCONTRACT_ABI);
    const preSaleReturnInfo = await IDOContract.preSaleInfoReturn(signerAddr);
    const userChainTokenBal = await provider.getBalance(signerAddr);
    const userChainTokenBalShow = ethers.utils.formatEther(userChainTokenBal);
    const preTokenAddr = preSaleReturnInfo.presaleTokenAddress.toString();
    const preTokenSym = preSaleReturnInfo.presaleTokenSymbol.toString();
    const preTokenDec = preSaleReturnInfo.presaleTokenDecimals.toString();
    const userPreSaleTokenBal = ethers.utils.formatUnits(preSaleReturnInfo.userPreSaleTokenBal, preTokenDec);
    const price = ethers.utils.formatEther(preSaleReturnInfo.price);
    const minAmount = ethers.utils.formatUnits(preSaleReturnInfo.minAmount, 18);
    const maxAmount = ethers.utils.formatUnits(preSaleReturnInfo.maxAmount, 18);
    const startTime = preSaleReturnInfo.startTime.toString();
    const duration = preSaleReturnInfo.duration.toString();
    const totalSold = ethers.utils.formatUnits(preSaleReturnInfo.totalSold, preTokenDec);
    const totalEarned = ethers.utils.formatUnits(preSaleReturnInfo.totalEarned, preTokenDec);
    const totalBonus = ethers.utils.formatUnits(preSaleReturnInfo.totalBonus, preTokenDec);
    const whitelistIsEnable = preSaleReturnInfo.whitelistIsEnable;
    const userSpentAmount = ethers.utils.formatEther(preSaleReturnInfo.userSpentAmount);
    const userBoughtAmount = ethers.utils.formatUnits(preSaleReturnInfo.userBoughtAmount, preTokenDec);
    const userRewardsAmount = ethers.utils.formatUnits(preSaleReturnInfo.userRewardsAmount, preTokenDec);
    const userBonusesAmount = ethers.utils.formatUnits(preSaleReturnInfo.userBonusesAmount, preTokenDec);
    const vestingManagersCount = preSaleReturnInfo.vestingManagersCount.toString();
    const isWhitelisted = preSaleReturnInfo.IsWhitelisted;
    const userReferrer = preSaleReturnInfo.userReferrer.toString();
    const totalDistributionRatio = preSaleReturnInfo.totalDistributionRatio.toString();
    const hardCap = 784000;
    const progress = Number(totalSold) / hardCap * 100;
    const vestingManagers = preSaleReturnInfo.vestingManagers;
    const userVestingWallets = preSaleReturnInfo.userVestingWallets;

    setHomeData((paveState: HomeDataProps) => {
      return {
        ...paveState,
        Price: preSaleReturnInfo.price.toString(),
        PriceShow: price,
        MinAmount: minAmount,
        MaxAmount: maxAmount,
        StartTime: startTime,
        Duration: duration,
        TotalSold: totalSold,
        TotalEarned: totalEarned,
        TotalBonus: totalBonus,
        PreTokenAddr: preTokenAddr,
        PreTokenSym: preTokenSym,
        PreTokenDec: preTokenDec,
        UserPreTokenBal: userPreSaleTokenBal,
        WhitelistIsEnable: whitelistIsEnable,
        UserSpentAmount: userSpentAmount,
        UserBoughtAmount: userBoughtAmount,
        UserRewardsAmount: userRewardsAmount,
        UserBonusesAmount: userBonusesAmount,
        VestingManagersCount: vestingManagersCount,
        IsWhitelisted: isWhitelisted,
        UserReferrer: userReferrer,
        VestingManagers: vestingManagers,
        UserVestingWallets: userVestingWallets,
        TotalDistributionRatio: totalDistributionRatio,
        UserChainTokenBal: userChainTokenBalShow,
        WalletAddr: signerAddr,
        UserReferrerUrl: `http://127.0.0.1:8081/?ref=${signerAddr}`,
        Progress: progress,
      };
    });

    if (Number(preSaleReturnInfo.userBoughtAmount) > 0) {
      getUserVestingWalletContractInfo(preTokenAddr, preTokenDec, userVestingWallets);
    } else {
      setUserVestingWalletInfo(VestingWalletInitState);
    }
  };
  const getUserVestingWalletContractInfo = async (preSaleTokenAddr: any, preTokenDec: any, userVestingWallets: string[]) => {
    try {
      if (Number(userVestingWallets.length) > 0 && userVestingWallets[0] !== "0x0000000000000000000000000000000000000000") {
        const vestingWalletContract = InstancedContract(userVestingWallets[0], MANAGEDVESTINGWALLET_ABI);
        const releasedPreToken = await vestingWalletContract.released(preSaleTokenAddr);
        const releasablePreToken = await vestingWalletContract.releasable(preSaleTokenAddr);
        const beneficiary = await vestingWalletContract.beneficiary();
        const startTime = await vestingWalletContract.start();
        const duration = await vestingWalletContract.duration();
        setUserVestingWalletInfo((UserVestingWalletData: VestingWalletInfo) => {
          return (UserVestingWalletData = {
            VestingWalletAddr: userVestingWallets[0],
            ReleasedPreToken: FormatUnitsConver(releasedPreToken, preTokenDec),
            ReleasablePreToken: FormatUnitsConver(releasablePreToken, preTokenDec),
            Beneficiary: beneficiary.toString(),
            StartTime: startTime.toString(),
            Duration: duration.toString(),
            VestedAmount: FormatUnitsConver(releasablePreToken, preTokenDec),
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  const Token0InputOnChange = async (value: any, data: HomeDataProps) => {
    setHomeData((paveState: any) => {
      return {
        ...paveState,
        Token0InputShow: floatformat(value),
      };
    });

    if (userReferrer !== "0x0000000000000000000000000000000000000000") {
      if (homeData.UserReferrer !== "0x0000000000000000000000000000000000000000") {
        if (homeData.UserReferrer !== userReferrer) {
          setBuyError((olddata: BuyErrorHandle) => {
            return {
              ...olddata,
              IncorrectRefError: true
            }
          })
        } else {
          setBuyError((olddata: BuyErrorHandle) => {
            return {
              ...olddata,
              IncorrectRefError: false
            }
          })
        }
      }
    }

    if (Number(floatformat(value)) > 0
      && Number(homeData.UserChainTokenBal) >= Number(floatformat(value))
      && Number(floatformat(value)) < Number(homeData.MinAmount)) {
      setBuyError((olddata: BuyErrorHandle) => {
        return {
          ...olddata,
          MinAmountError: true
        }
      })
    } else {
      setBuyError((olddata: BuyErrorHandle) => {
        return {
          ...olddata,
          MinAmountError: false
        }
      })
    }

    if (Number(floatformat(value)) > 0
      && Number(homeData.UserChainTokenBal) >= Number(floatformat(value))
      && Number(homeData.UserSpentAmount) + Number(floatformat(value)) > Number(homeData.MaxAmount)) {
      setBuyError((olddata: BuyErrorHandle) => {
        return {
          ...olddata,
          MaxAmountError: true
        }
      })
    } else {
      setBuyError((olddata: BuyErrorHandle) => {
        return {
          ...olddata,
          MaxAmountError: false
        }
      })
    }

    if (Number(homeData.UserChainTokenBal) < Number(floatformat(value))) {
      setBuyError((olddata: BuyErrorHandle) => {
        return {
          ...olddata,
          InsufficientBalError: true
        }
      })
    } else {
      setBuyError((olddata: BuyErrorHandle) => {
        return {
          ...olddata,
          InsufficientBalError: false
        }
      })
    }

    if (floatformat(value) !== "") {
      const TokenOutputInfo: any = await Token0InputValueOnChange(value, data);
      setHomeData((paveState: any) => {
        return {
          ...paveState,
          Token0Input: ethers.utils.parseEther(value),
          Token1Output: TokenOutputInfo.amountOut,
        };
      });
    } else {
      setHomeData((paveState: any) => {
        return {
          ...paveState,
          Token0: "",
          Token0InputShow: "",
          Token1Output: "",
        };
      });
      setBuyError((olddata: BuyErrorHandle) => {
        return {
          ...olddata,
          InsufficientBalError: false,
          MinAmountError: false,
          MaxAmountError: false,
        }
      })
    }
  };
  const BuyOnClick = async () => {
    try {
      setBuyLoading(true);
      const IDOContract = InstancedContract(IDOCONTRACT_ADDR, IDOCONTRACT_ABI);
      const buy = await IDOContract.buy(userReferrer, { value: homeData.Token0Input });
      await buy.wait();
      setBuyLoading(false);
    } catch (error) {
      setBuyLoading(false);
    }
  };
  const ClaimOnClick = async (preSaleTokenAddr: any, userVestingWallets: string[]) => {
    try {
      setClaimLoading(true);
      const vestingWalletContract = InstancedContract(userVestingWallets[0], MANAGEDVESTINGWALLET_ABI);
      const release = await vestingWalletContract.release(preSaleTokenAddr);
      await release.wait();
      setClaimLoading(false);
    } catch (error) {
      setClaimLoading(false);
    }
  }
  useEffect(() => {
    if (window.location.search !== "") {
      const url = window.location.search;
      setUserReferrer(url.split("?ref=")[1]);
    }
  }, [userReferrer]);
  useEffect(() => {
    const ethereum = window.ethereum;
    ethereum.on('chainChanged', (chainId: string) => {
      if (Number(chainId) === 421613) {
        setIsCorrectChain(true)
        if (localStorage.getItem("wagmi.connected") === "true") {
          ethereum.on("accountsChanged", (accounts: any) => {
            IsConnectGetdata();
            GetInitData();
          });
        } else {
          setIsCorrectChain(false)
          setHomeData(HomeInitData);
          setUserVestingWalletInfo(VestingWalletInitState)
        }
      } else {
        setIsCorrectChain(false)
        setHomeData(HomeInitData);
        setUserVestingWalletInfo(VestingWalletInitState)
      }
    });
  }, []);
  useEffect(() => {
    timerGetStatus = setInterval(async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();

      if (Number(chainId) === 421613) {
        setIsCorrectChain(true)
        if (localStorage.getItem("wagmi.connected") === "true") {
          IsConnectGetdata();
          GetInitData();
          clearInterval(timerGetStatus);
        } else {
          setIsCorrectChain(false)
          setHomeData(HomeInitData);
          setUserVestingWalletInfo(VestingWalletInitState)
        }
      } else {
        setIsCorrectChain(false)
        setHomeData(HomeInitData);
        setUserVestingWalletInfo(VestingWalletInitState)
      }
    }, 500);
    return () => {
      clearInterval(timerGetStatus);
    };
  }, [localStorage.getItem("wagmi.connected"), homeData, userVestingWalletInfo]);
  return (
    <div className="HomeComponent">
      {contextHolder}
      <Modal
        title={popupTitle}
        open={openPolicyPopup}
        onCancel={ClosePopup}
        footer={null}
      >
        <div className="clause">{clauseText}</div>
      </Modal>
      <div className="HomeComponentItem">
        <div className="selectbutton_area">
          <div
            className="selectbutton_item"
            onClick={() => {
              setButtonMode(1);
            }}
            style={{ backgroundColor: buttonMode === 1 ? '#F95192' : '#000000' }}
          >
            {buttonMode === 1 ? (
              <img src={PresaleImageActive} alt="" />
            ) : (
              <img src={PresaleImage} alt="" />
            )}
            <span style={{ color: buttonMode === 1 ? "#F95192" : "#000000" }}>
              Presale
            </span>
          </div>
          <div
            className="selectbutton_item"
            onClick={() => {
              setButtonMode(2);
            }}
            style={{ backgroundColor: buttonMode === 2 ? '#F95192' : '#000000' }}
          >
            {buttonMode === 2 ? (
              <img src={ExchangeImageActive} alt="" />
            ) : (
              <img src={ExchangeImage} alt="" />
            )}
            <span style={{ color: buttonMode === 2 ? "#F95192" : "#000000" }}>
              Exchange
            </span>
          </div>
          <div
            className="selectbutton_item"
            onClick={() => {
              setButtonMode(3);
            }}
            style={{ backgroundColor: buttonMode === 3 ? '#F95192' : '#000000' }}
          >
            {buttonMode === 3 ? (
              <img src={UserInfoActive} alt="" />
            ) : (
              <img src={UserInfo} alt="" />
            )}
            <span style={{ color: buttonMode === 3 ? "#F95192" : "#000000" }}>
              User
            </span>
          </div>
        </div>
        <div className="HomeComponentItemTilei">
          <div className="ItemHowerTitle">
            {buttonMode === 1 ? "Presale Info" : buttonMode === 2 ? "Exchange" : "User Info"}
          </div>
          <div className="ComponentItemHower">
            {buttonMode === 1 ?
              <>
                <div className="ItemTileiLent">
                  <div className="ItemBalance">
                    <div className="ItemBalanceSon">
                      {homeData.UserBoughtAmount}
                    </div>
                    <div className="ItemBalanceSon">
                      {homeData.TotalSold}
                    </div>
                  </div>
                  <div className="ItemBalance">
                    <div className="ItemBalanceFon">
                      Your purchased {homeData.PreTokenSym}
                    </div>
                    <div className="ItemBalanceFon">
                      Total {homeData.PreTokenSym} Sold
                    </div>
                  </div>
                  <div className="progress_area">
                    <div className="ItemPrice">
                      <Progress
                        percent={homeData.Progress}
                        strokeColor="#F95192"
                        format={(percent: any) => {
                          return `${homeData.TotalSold}`;
                        }}
                      />
                    </div>
                    <div className="ItemFunea">
                      <div className="ItemFuneaItem">
                        {homeData.PreTokenSym} Price: 1 ETH = 100 {homeData.PreTokenSym}
                      </div>
                      <div className="ItemFuneaItem">Soft Target: 392,000</div>
                      <div className="ItemFuneaItem">Hard Target: 784,000</div>
                    </div>
                  </div>
                  <div className="ItemNuers">
                    <div className="ItemTileiRentValue">
                      Bonus 3% from 2500 purchase. Bonus 5% from 5000 purchase
                    </div>
                  </div>
                  <div className="ItemImali">
                    <div className="ItemImali_imge">
                      <img src={MetaMask} alt="" />
                    </div>
                    <div className="ItemImali_imge asioer">
                      <img src={TrustWall} alt="" />
                    </div>
                    <div className="ItemImali_imge">
                      <img src={WallCont} alt="" />
                    </div>
                  </div>
                </div>
              </> : buttonMode === 2 ?
                <>
                  <div className="ItemTileiRent">
                    <div className="ItemTileiRentItem">
                      <div className="ItemTirenInputData">
                        <div className="ItemTirenInputone">
                          <div className="ItemTirenInputoneTeleb">
                            <div className="ItemTirenInputoPuoen">
                              <img src={coienARM} alt="" />
                              <div className="ItemTirenPuoenValue">
                                ETH
                              </div>
                            </div>
                          </div>
                          <div className="ItemTirenInputoneNrowl">
                            <input
                              type="text"
                              disabled={localStorage.getItem("wagmi.connected") !== "true" || !isCorrectChain}
                              placeholder="0"
                              value={homeData.Token0InputShow || ""}
                              onChange={(e) => {
                                Token0InputOnChange(e.target.value, homeData);
                              }}
                            />
                          </div>
                        </div>
                        <div className="ItemTirenICones">
                          <div className="ItemTirenIConesItem">
                            <ArrowDownOutlined twoToneColor="#F95192" />
                          </div>
                        </div>
                        <div className="ItemTirenInputtwo">
                          <div className="ItemTirenInputoneTeleb">
                            <div className="ItemTirenInputoPuoen">
                              <img src={coienARM} alt="" />
                              <div className="ItemTirenPuoenValue">
                                {homeData.PreTokenSym}
                              </div>
                            </div>
                          </div>
                          <div className="ItemTirenInputoneNrowl">
                            <input
                              type="text"
                              placeholder="0"
                              disabled={true}
                              value={homeData.Token1Output || ""}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ItemTirenTeles">
                        <div className="ItemTirenTelesItem">
                          <span>MINIMUM BUY:</span>
                          <span style={{ color: "#F95192" }}>
                            {homeData.MinAmount} ETH
                          </span>
                        </div>
                        <div className="ItemTirenTelesItem">
                          <span>MAXIMUM BUY:</span>
                          <span style={{ color: "#F95192" }}>
                            {homeData.MaxAmount} ETH
                          </span>
                        </div>
                      </div>
                      <div className="ItemTirenbtone">
                        {localStorage.getItem("wagmi.connected") === "true" ?
                          <>
                            {isCorrectChain ?
                              <>
                                {CanBuy() ?
                                  <>
                                    <button
                                      onClick={() => {
                                        BuyOnClick();
                                      }}
                                    >
                                      {buyLoading ?
                                        <>
                                          <div className="piseLoce">
                                            <RedoOutlined spin />
                                          </div>
                                        </> : <></>
                                      }{" "}
                                      <span>Buy</span>
                                    </button>
                                  </> : Number(homeData.Token0InputShow) > 0 && buyError.InsufficientBalError ?
                                    <>
                                      <button disabled className="ButyPoe">
                                        Token balance less than amount
                                      </button>
                                    </> : Number(homeData.Token0InputShow) > 0 && !buyError.InsufficientBalError && buyError.MinAmountError ?
                                      <>
                                        <button disabled className="ButyPoe">
                                          Amount less than the minimum
                                        </button>
                                      </> : Number(homeData.Token0InputShow) > 0 && !buyError.InsufficientBalError && buyError.MaxAmountError ?
                                        <>
                                          <button disabled className="ButyPoe">
                                            Amount greater than the maximum
                                          </button>
                                        </> :
                                        <>
                                          <button disabled className="ButyPoe">
                                            Buy
                                          </button>
                                        </>
                                }
                              </> :
                              <>
                                <Web3NetworkSwitch />
                              </>
                            }
                          </> :
                          <>
                            <Web3Button label="Connect Wallet" icon="hide" />
                          </>
                        }
                      </div>
                      <div className="ItemTirenFoonte">
                        By making a purchase of {homeData.PreTokenSym} tokens,
                        you need to agree to the{" "}
                        <span
                          className="clause_textdec"
                          onClick={() => {
                            setOpenPolicyPopup(true);
                          }}
                        >
                          Terms
                        </span>
                        ,
                        <span
                          className="clause_textdec"
                          onClick={() => {
                            setOpenPolicyPopup(true);
                          }}
                        >
                          Privacy Policy
                        </span>
                        and{" "}
                        <span
                          className="clause_textdec"
                          onClick={() => {
                            setOpenPolicyPopup(true);
                          }}
                        >
                          Legal Notice
                        </span>
                        .
                      </div>
                    </div>
                    <div className="exchange-right">
                      <div className="exchange_rightImage">
                        <img src={icon012} alt="" className="" />
                      </div>
                      <div className="ItemTirenLuins">
                        <div className="ItemTirenLuinsValue">
                          {" "}
                          To purchase {homeData.PreTokenSym}, You need to confirm 1 transactions:
                        </div>
                        <div className="ItemTirenLuinsValue">
                          Click the buy button and then click the confirm button. If no transactions are
                          received to your wallet, reconnect the wallet to the
                          launchpad
                        </div>
                      </div>
                    </div>
                  </div>
                </> : buttonMode === 3 ?
                  <>
                    <div className="ItemuserInfo">
                      <img src={UserInfoLogo} alt="" className="UserInfoLogo" />
                      <div className="link_title">My referral link:</div>
                      <div className="ItemuserInfo_link">
                        <div className="ItemFonteNrokn">
                          {localStorage.getItem("wagmi.connected") === "true" ?
                            <>
                              {isCorrectChain ?
                                <>
                                  <div
                                    className="ItemFonteNroknTitleL"
                                    style={{
                                      justifyContent: "initial",
                                    }}
                                  >
                                    {`http://127.0.0.1:8081/?ref=${homeData.WalletAddr}`}
                                  </div>
                                  <div
                                    className="ItemFonteNroknValeu"
                                    onClick={() => {
                                      CopyOnClick();
                                    }}
                                  >
                                    <span>Copy</span>
                                  </div>
                                </> :
                                <>
                                  <div className="ItemFonteNroknTitle">
                                    Please switch to the correct network
                                  </div>
                                  <Web3NetworkSwitch />
                                </>
                              }
                            </> :
                            <>
                              <div className="ItemFonteNroknTitle">
                                Please connect the wallet first
                              </div>
                              <Web3Button label="Connect" icon="hide" />
                            </>
                          }
                        </div>
                        <div className="ItemFonteButon">
                        </div>
                      </div>
                      <div className="userInfodata">
                        <div className="claimreceive">
                          <div className="claim_title">Your claimed:  {userVestingWalletInfo.ReleasedPreToken}</div>
                          <div className="claim_title">Your claimable:  {userVestingWalletInfo.ReleasablePreToken}</div>
                          {Number(userVestingWalletInfo.ReleasablePreToken) > 0 ?
                            <>
                              <div
                                className="receivebutton"
                                onClick={() => {
                                  ClaimOnClick(homeData.PreTokenAddr, homeData.UserVestingWallets)
                                }}
                              >
                                {claimLoading ? <> <div className="piseLoce"><RedoOutlined spin /></div> </> : <></>}{" "}
                                Receive
                              </div>
                            </> :
                            <>
                              <div
                                className="receivedisablebutton"
                              >
                                Receive
                              </div>
                            </>
                          }

                        </div>
                        <div className="yourdata">
                          <div className="yourdataitem">
                            <div className="dataLabel">{homeData.UserSpentAmount} ETH</div>
                            <div className="datatitle">Your cost</div>
                          </div>
                          <div className="yourdataitem">
                            <div className="dataLabel">{homeData.UserBonusesAmount}{" "}{homeData.PreTokenSym}</div>
                            <div className="datatitle">Your bonus</div>
                          </div>
                          <div className="yourdataitem">
                            <div className="dataLabel">{homeData.UserBoughtAmount}{" "}{homeData.PreTokenSym}</div>
                            <div className="datatitle">Your purchased</div>
                          </div>
                          <div className="yourdataitem">
                            <div className="dataLabel">{homeData.UserRewardsAmount}{" "}{homeData.PreTokenSym}</div>
                            <div className="datatitle">Your refferal bonus</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </> : <></>
            }
          </div>
          {buttonMode === 1 ? <img src={ico11} className="icon011" /> : ""}
          {buttonMode === 2 ?
            <>
              <img src={icon014} className="icon014" />
              <img src={icon013} className="icon013" />
            </> : <></>
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
