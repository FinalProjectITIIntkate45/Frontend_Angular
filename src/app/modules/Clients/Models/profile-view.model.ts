export interface ProfileViewModel {
    userName: string;       // في ملف البروفايل
    email: string;
    phoneNumber: string;
    profileImg: string;
    BalancePoints: number;
    BalanceCash: number;
  }
  
  export interface LoginResponse {
    token: string;
    role: string;
    username: string;       // في ملف اللوجين بحروف صغيرة كلها
    email: string;
  }
  