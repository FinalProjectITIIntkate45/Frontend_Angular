export interface CreateProductRequest {
  name: string;
  description: string;
  stock: number;
  basePrice: number;
  points: number;
  categoryId: number;
  increaseRate?: number;
  discountPercentage?: number;
  isSpecialOffer: boolean;
  attachments: File[];
  
  // for send the data to the server api
  productAttrVms: {
    attributeId: number;
    value: string;
  }[];
}
