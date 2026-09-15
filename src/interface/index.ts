export interface User {
  _id: string;
  name: string;
  googleId: string;
  email: string;
  role: "unverified" | "applied" | "intern" | "admin";
  batch: {
    batchId?: number;
    domain?: "web" | "ai" | "app";
    referenceNo?: string;
    leader?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  _id: string;
  referenceNo: string;
  batchId: number;
  domain: string;
  date: string;
}