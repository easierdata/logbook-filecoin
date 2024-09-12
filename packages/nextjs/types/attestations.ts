interface AttestationField<T> {
  name: string;
  type: string;
  signature: string;
  value: { name: string; type: string; value: T };
}

interface LocationAttestation {
  eventTimestamp: AttestationField<object>;
  location: AttestationField<object>;
  locationType: AttestationField<object>;
  mediaData: AttestationField<object>;
  mediaType: AttestationField<object>;
  memo: AttestationField<object>;
  recipePayload: AttestationField<object>;
  recipeType: AttestationField<object>;
  srs: AttestationField<object>;
}

export type { LocationAttestation, AttestationField };