export interface Charity {
  id: number;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  logoUrl: string;
  createdAt: string;
  imageUrl: string;
  charityId: number;
  charityImages: CharityImage[];
}

export interface CharityImage {
  imageUrl: string;
  charity: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    imageUrl: string;
  };
}
