import { StarknetConfig, braavos, publicProvider, useInjectedConnectors } from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";

const alchemySepolia = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [
        "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/pSdnR2sT6vam6LCSXurnEoTzoWvyCdwU"
      ]
    },
    public: {
      http: [
        "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/pSdnR2sT6vam6LCSXurnEoTzoWvyCdwU"
      ]
    }
  }
};


export function StarknetProvider({ children }:any) {
  const { connectors } = useInjectedConnectors({
    recommended: [braavos()],
    includeRecommended: "always",
  });

  return (
    <StarknetConfig 
      chains={[alchemySepolia]}
      provider={publicProvider()}
      connectors={connectors}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
