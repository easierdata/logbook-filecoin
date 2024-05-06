// import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import React, { createContext, useEffect, useState } from "react";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import easConfig from "~~/EAS.config";
// import { foundry } from "viem/chains";
import { useEthersSigner } from "~~/utils/useEthersSigner";

const EASContractAddress = easConfig.EAS_CONTRACT_SEPOLIA;
const eas = new EAS(EASContractAddress);

const EASContext = createContext({ eas, isReady: false });

const EASProvider = ({ children }: { children: React.ReactNode }) => {
  const signer = useEthersSigner();
  const [signerReady, setSignerReady] = useState(false);

  useEffect(() => {
    signer?.provider
      .getSigner()
      .then(() => {
        signer && eas.connect(signer);
        setSignerReady(true);
      })
      .catch(err => console.log("[🧪 DEBUG](err):", err));
  });

  return <EASContext.Provider value={{ eas, isReady: signerReady }}>{children}</EASContext.Provider>;
};

export { EASContext, EASProvider };
