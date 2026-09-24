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
    location?: "remote" | "onsite";
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
  location: string;
  status?: "present" | "absent";
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  batchId: number;
  domain: "web" | "ai" | "app";
  location: "onsite" | "remote";
  deadline: string; // Date ISO string from API
  status: "pending" | "completed";
  createdAt?: string;
  updatedAt?: string;
}