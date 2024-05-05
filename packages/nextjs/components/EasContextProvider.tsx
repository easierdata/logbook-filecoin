// import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import React, { createContext, useEffect } from "react";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { foundry } from "viem/chains";
import easConfig from "~~/EAS.config";
// import { foundry } from "viem/chains";
import { useEthersSigner } from "~~/utils/useEthersSigner";

const EASContractAddress = easConfig.EAS_CONTRACT_SEPOLIA;
const eas = new EAS(EASContractAddress);

const EASContext = createContext(eas);

const EASProvider = ({ children }: { children: React.ReactNode }) => {
  const signer = useEthersSigner({ chainId: foundry.id });
  useEffect(() => {
    signer && eas.connect(signer);
  });
  return <EASContext.Provider value={eas}>{children}</EASContext.Provider>;
};

export { EASContext, EASProvider };
