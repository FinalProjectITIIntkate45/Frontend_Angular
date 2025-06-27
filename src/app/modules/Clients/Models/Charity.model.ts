export interface Charity {
  Id: number;
  Name: string;
  Description: string;
  ContactEmail: string;
  ContactPhone: string;
  Website: string;
  LogoUrl: string;
  CreatedAt?: string;
  CharityImages: CharityImage[];
}

export interface CharityImage {
  Id: number;
  CharityId: number;
  ImageUrl: string;
  CreatedAt: string;
  Charity?: any;
}

