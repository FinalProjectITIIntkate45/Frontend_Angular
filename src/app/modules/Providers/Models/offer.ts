import { OfferProduct } from "./OfferProduct";

export interface Offer {
    Id : number;
      File?: File;
    OfferImgUrl: string;
    Status: number;
    OldPrice: number;
    NewPrice: number;
    OldPoints: number;
    NewPoints: number;
    StartDate: string;
    EndDate: string;
    offerProducts: OfferProduct[];
}