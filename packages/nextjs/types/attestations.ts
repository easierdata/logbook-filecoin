interface AttestationField<T> {
  name: string;
  type: string;
  signature: string;
  value: { name: string; type: string; value: T };
}

interface LocationAttestation {
  eventTimestamp: AttestationField<bigint>;
  location: AttestationField<string>;
  locationType: AttestationField<string>;
  mediaData: AttestationField<string[]>;
  mediaType: AttestationField<string[]>;
  memo: AttestationField<string>;
  recipePayload: AttestationField<string[]>;
  recipeType: AttestationField<string[]>;
  srs: AttestationField<string>;
}

export type { LocationAttestation, AttestationField };