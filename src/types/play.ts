export interface PlayClaimRequest {
  token: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string; // Required for notifications
  age: number;
  acceptTerms: boolean;
}

export interface PlayResult {
  playId: string;
  result: {
    prizeType: string;
    prizeValue?: string;
    description?: string;
    isWinner: boolean;
    resultCode: string;
  };
  emailSent: boolean;
}

export interface PlayStatus {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  resultCode: string;
  prizeType: string;
  isWinner: boolean;
  isRedeemed: boolean;
  redeemedAt?: string;
  createdAt: string;
}

export interface ResultType {
  id: string;
  name: string;
  code: string;
  description?: string;
  prizeValue?: string;
  weight: number;
  stockLimit?: number;
  distributedCount: number;
  redeemedCount: number;
  isPrize: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Token {
  id: string;
  code: string;
  metadata?: any;
  isUsed: boolean;
  usedAt?: string;
  createdAt: string;
  expiresAt?: string;
  play?: PlayStatus;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface DashboardStats {
  tokens: {
    total: number;
    used: number;
    available: number;
  };
  plays: {
    total: number;
    today: number;
    thisWeek: number;
    redeemed: number;
  };
  resultTypes: Array<ResultType & { playsCount: number }>;
}

export interface PlaySearchResult {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  resultCode: string;
  prizeType: string;
  isWinner: boolean;
  isRedeemed: boolean;
  redeemedAt?: string;
  createdAt: string;
}
