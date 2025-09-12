import type { User } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

export const mockUsers: User[] = [
  { id: 'u1', name: 'Aarav Sharma', avatarUrl: getImage('user-1')?.imageUrl || '', imageHint: 'person face', points: 2450, rank: 1 },
  { id: 'u2', name: 'Saanvi Gupta', avatarUrl: getImage('user-2')?.imageUrl || '', imageHint: 'woman smiling', points: 2210, rank: 2 },
  { id: 'u3', name: 'Vikram Singh', avatarUrl: getImage('user-3')?.imageUrl || '', imageHint: 'man portrait', points: 1980, rank: 3 },
  { id: 'u4', name: 'Diya Patel', avatarUrl: getImage('user-4')?.imageUrl || '', imageHint: 'person glasses', points: 1850, rank: 4 },
  { id: 'u5', name: 'Rohan Kumar', avatarUrl: getImage('user-5')?.imageUrl || '', imageHint: 'woman portrait', points: 1720, rank: 5 },
];

export const currentUser = mockUsers[0];
