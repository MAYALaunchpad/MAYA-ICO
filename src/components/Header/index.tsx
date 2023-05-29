import { useEffect } from "react";
import International from "../../components/International";
import "./index.scss";
import loges from "../../assets/image/ico6.png";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal, useWeb3ModalTheme } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrumGoerli } from "wagmi/chains";
import { Web3Button } from "@web3modal/react";

const chains = [arbitrumGoerli];
const projectId = "b98a412bd29c5618fe10c37180fa6813";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

const Cwallet = (posps: any) => {
  const { setTheme } = useWeb3ModalTheme();
  setTheme({
    themeMode: "light",
    themeVariables: {
      "--w3m-font-family": "Roboto, sans-serif",
      "--w3m-accent-color": "#ff51a0",
      "--w3m-logo-image-url": `${loges}`,
      "--w3m-background-color": "#ff51a0",
      "--w3m-background-image-url": `${loges}`,
      "--w3m-button-hover-highlight-border-radius": "0rem",
    },
  });
  useEffect(() => { }, []);
  return (
    <div className="Headeer">
      <div className="HeaderComponent">
        <div className="HeaderIcones">
          <img src={loges} alt="" />
        </div>
        <div className="HaderButtonGroup">
          <div className="HaderLoser">
            <International />
          </div>
          <div className="HaderButton">
            <WagmiConfig client={wagmiClient}>
              <Web3Button label="Connect Wallet" icon="hide" />
            </WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cwallet;
