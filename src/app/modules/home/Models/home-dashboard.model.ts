export interface TopProduct {
  Id: number;
  Name: string;
  BasePrice: number;
  ImageUrl?: string;
  Rate:number;
  Count: number;
}

export interface BestSellers {
  Id: number;
  Name: string;
  BasePrice: number;
  ImageUrl?: string;
  Rate:number;
  Count: number;
}

export interface FeaturedShop {
  Id: number;
  Name: string;
  City: string;
  Latitude: number;
  Longitude: number;
  BusinessPhone: string;
  Logo: string;
  CreatedAt: string;
  ModificationDate: string;
  Status: number;
  IsDeleted: boolean;
  TypeId: number;
}
export interface Offers {
  Id: number;
  offerPricePoint: number;
  OfferImgUrl?: string;
  Status: number;
  OldPrice: number;
  NewPrice: number;
  OldPoints: number;
  NewPoints: number;
  StartDate: string;
  EndDate: string;
  Products: {
    Productname: string;
    ProductId: number;
    ProductQuantity: number;
    Type: string;
  }[];
}

export interface FeaturedShop {
  Id: number;
  Name: string;
  Description: string;
  Address: string;
  City: string;
  Street: string;
  PostalCode: string;
  Latitude: number;
  Longitude: number;
  BusinessPhone: string;
  BusinessEmail: string;
  Logo: string;
  CreatedAt: string;
  ModificationDate: string;
  Status: number;
  IsDeleted: boolean;
  ProviderId: string;
  TypeId: number; 
  ShopImages: any[];
}



export interface ShopType {
  Id: number;
  Name: string;
  Icon: string;
}

export interface HomeDashboard {
  Offers: any[]; 
  FeaturedShops: FeaturedShop[];
  TopProducts: TopProduct[];
BestSellers: BestSellers[];
  ShopTypes: ShopType[];
}
