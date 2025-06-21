import { OfferProductViewModel } from "./OfferProductViewModel";

export interface OfferViewModel {
  Id: number;
  OfferImgUrl: string;
  file?: File;
  Status: number;
  OldPrice: number;
  NewPrice: number;
  OldPoints: number;
  NewPoints: number;
  StartDate: string;
  EndDate: string;
  Products: OfferProductViewModel[];
} 