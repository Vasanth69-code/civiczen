import type { Timestamp } from "firebase/firestore";

export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export type Issue = {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  department: string;
  location: { lat: number; lng: number };
  address: string;
  imageUrl?: string;
  imageHint?: string;
  reporter: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: Timestamp;
};

export type User = {
    id: string;
    name:string;
    avatarUrl: string;
    imageHint?: string;
    points: number;
    rank: number;
};
