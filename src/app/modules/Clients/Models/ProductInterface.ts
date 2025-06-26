export interface ProductInterface {
    Id: number;
    Name: string;
    Description: string;
    Stock: number;
    BasePrice: number;
    Points: number;
    CategoryName: string;
    ShopName: string;
    CreatedAt: string;
    Images: string[];
    ModificationDate: string;
    CategoryId: number;
    DisplayedPrice: number;
    DisplayedPriceAfterDiscount?: number;
    IsSpecialOffer: boolean;
    EarnedPoints: number;
}
