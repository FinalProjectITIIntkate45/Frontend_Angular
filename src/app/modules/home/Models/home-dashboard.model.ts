export interface TopProduct {
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

export interface ShopType {
  Id: number;
  Name: string;
  Icon: string;
}

export interface HomeDashboard {
  Offers: any[]; // لو في future structure اعملي لها موديل لوحدها
  FeaturedShops: FeaturedShop[];
  TopProducts: TopProduct[];
  RecentReviews: any[]; // ممكن تعملي Review interface بعدين
  ShopTypes: ShopType[];
}
