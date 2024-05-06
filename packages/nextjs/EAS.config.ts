export type EASConfig = {
  EAS_CONTRACT_SEPOLIA: string;
  ATTESTATION_ID: string;
};

const easConfig = {
  // EAS.sol contract Sepolia
  EAS_CONTRACT_SEPOLIA: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e", // Sepolia v0.26,
  ATTESTATION_ID: "0xff08bbf3d3e6e0992fc70ab9b9370416be59e87897c3d42b20549901d2cccc3e",
} as const satisfies EASConfig;

export default easConfig;
