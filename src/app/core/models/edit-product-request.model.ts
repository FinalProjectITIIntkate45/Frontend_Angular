import { CreateProductRequest } from "./create-product-request.model";

export interface EditProductRequest extends CreateProductRequest {
  id: number;
  existingImages: string[];
}
