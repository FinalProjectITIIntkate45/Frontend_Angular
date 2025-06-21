import { OfferProductViewModel } from "./OfferProductViewModel";

export interface OfferViewModel {
Name: any;
  Id: number;
  OfferImgUrl: string;
  Status: number;
  OldPrice: number;
  NewPrice: number;
  OldPoints: number;
  NewPoints: number;
  StartDate: string;
  EndDate: string;
  Products: OfferProductViewModel[];
} 