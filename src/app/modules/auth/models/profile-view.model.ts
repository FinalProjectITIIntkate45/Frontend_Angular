// public string UserId { get; set; }
//     public string UserName { get; set; } = "Unknown";
//     public string Email { get; set; }
//     public string PhoneNumber { get; set; } = "Unknown";
//     public string ProfileImg { get; set; }

//     // Wallet
//     public float BalancePoints { get; set; }
//     public float BalanceCash { get; set; }

//     // Points
//     public float TotalShopPoints { get; set; }
//     public float TotalFreePoints { get; set; }
//     public float TotalPendingPoints { get; set; }



export interface ProfileView {
  UserId: string;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  ProfileImg: string;

  // Wallet
  BalancePoints: number;
  BalanceCash: number;

  // Points
  TotalShopPoints: number;
  TotalFreePoints: number;
  TotalPendingPoints: number;
}
