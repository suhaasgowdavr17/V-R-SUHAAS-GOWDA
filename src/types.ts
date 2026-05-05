export interface UserProfile {
  userId: string;
  name: string;
  phone?: string;
  skills: string[];
  location?: string;
  createdAt: string;
}

export interface WorkEntry {
  id?: string;
  workerId: string;
  date: string;
  description: string;
  income: number;
  employerName: string;
  employerPhone?: string;
  status: 'unverified' | 'verified' | 'rejected';
  proofUrl?: string;
  createdAt: string;
}
