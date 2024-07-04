import { BytesLike } from "ethers";

export interface IFormValues {
  eventTimestamp: number;
  coordinateInputX: string;
  coordinateInputY: string;
  data: string;
  mediaType: string[];
  mediaData: BytesLike[];
}
