export type EASConfig = {
  EAS_CONTRACT_SEPOLIA: string;
};

const easConfig = {
  // EAS.sol contract Sepolia
  EAS_CONTRACT_SEPOLIA: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e", // Sepolia v0.26,
} as const satisfies EASConfig;

export default easConfig;
