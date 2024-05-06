export type EASConfig = {
  EAS_CONTRACT_SEPOLIA: string;
  ATTESTATION_ID: string;
  SCHEMA_UID_SEPOLIA: string;
};

const easConfig = {
  // EAS.sol contract Sepolia
  EAS_CONTRACT_SEPOLIA: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e", // Sepolia v0.26,
  ATTESTATION_ID: "0xff08bbf3d3e6e0992fc70ab9b9370416be59e87897c3d42b20549901d2cccc3e",
  SCHEMA_UID_SEPOLIA: "0x6e0109ece55132d0ee54ae63837b21f666fc3d44c55659fd8030f6c1825c8966", //"0x7408b55e86f7e249787fb617ddac48450fb7512609eb7c95fe6f97f49914f51e",
} as const satisfies EASConfig;

export default easConfig;
