export interface FollowedSeller {
  clientId: string;
  shopId: number;
  shop: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    image: string;
  };
}
