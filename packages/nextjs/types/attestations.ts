type AttestationValue = {
  name: string;
  type: string;
  value: string | string[] | bigint[] | { [key: string]: any };
};

type AttestationField = {
  name: string;
  type: string;
  signature: string;
  value: AttestationValue;
};

type LocationAttestation = {
  attestationId: string;
  attester: string;
  completed: boolean;
  eventTimestamp: AttestationField;
  expirationTime: bigint;
  initData: string;
  location: AttestationField;
  locationType: AttestationField;
  mediaData: AttestationField;
  mediaType: AttestationField;
  memo: AttestationField;
  recipePayload: AttestationField;
  recipeType: AttestationField;
  recipient: string;
  refUID: bigint;
  revocable: bigint;
  schemaUID: string;
  srs: AttestationField;
};

export type { LocationAttestation, AttestationField, AttestationValue };
