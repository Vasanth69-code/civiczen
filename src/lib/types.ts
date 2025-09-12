
export type Issue = {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
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
  createdAt: string;
};

export type User = {
    id: string;
    name: string;
    avatarUrl: string;
    imageHint?: string;
    points: number;
    rank: number;
};
