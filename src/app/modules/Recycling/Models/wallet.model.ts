export interface Wallet {
  BalancePoints: number;
  Balancecash: number;
  LastUpdated: string;
}

export interface WalletResponse {
  data: Wallet;
  success: boolean;
  message?: string;
} 