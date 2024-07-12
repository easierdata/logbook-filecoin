export type EASConfig = {
  EAS_CONTRACT_SEPOLIA: string;
  ATTESTATION_UID: string;
  SCHEMA_UID_SEPOLIA: string;
  RAW_SCHEMA_STRING: string;
};

const easConfig = {
  // EAS.sol contract Sepolia
  EAS_CONTRACT_SEPOLIA: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e", // Sepolia v0.26,
  ATTESTATION_UID: "0xff08bbf3d3e6e0992fc70ab9b9370416be59e87897c3d42b20549901d2cccc3e",
  SCHEMA_UID_SEPOLIA: "0xba4171c92572b1e4f241d044c32cdf083be9fd946b8766977558ca6378c824e2", //"0xd928da08c10180b639e31c5f46acf4ea011d88ec7ac44bd95f32385e2d66032b", //"0x6e0109ece55132d0ee54ae63837b21f666fc3d44c55659fd8030f6c1825c8966", //"0x7408b55e86f7e249787fb617ddac48450fb7512609eb7c95fe6f97f49914f51e",
  RAW_SCHEMA_STRING:
    "uint256 eventTimestamp,string srs,string locationType,string location,string[] recipeType,bytes[] recipePayload,string[] mediaType,string[] mediaData,string memo",
} as const satisfies EASConfig;

export default easConfig;
