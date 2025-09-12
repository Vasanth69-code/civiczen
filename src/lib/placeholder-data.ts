import type { User, Issue } from './types';
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

export const mockIssues: Issue[] = [
    {
      id: '1',
      title: 'Large Pothole on Main St',
      description: 'A very large and dangerous pothole has formed in the middle of Main St, near the crosswalk. It has already caused a cyclist to fall. Needs immediate attention.',
      status: 'Pending',
      category: 'Pothole',
      priority: 'High',
      department: 'Public Works',
      location: { lat: 40.7128, lng: -74.0060 },
      address: '123 Main St, New York, NY',
      imageUrl: getImage('issue-pothole')?.imageUrl,
      imageHint: "pothole road",
      reporter: mockUsers[1],
      createdAt: new Date('2023-10-26T10:00:00Z'),
    },
    {
      id: '2',
      title: 'Overflowing Trash Can at City Park',
      description: 'The main trash can near the park entrance is completely full and overflowing. It\'s attracting pests and creating a mess.',
      status: 'In Progress',
      category: 'Garbage Overflow',
      priority: 'Medium',
      department: 'Parks & Recreation',
      location: { lat: 34.0522, lng: -118.2437 },
      address: '456 City Park Ave, Los Angeles, CA',
      imageUrl: getImage('issue-trash')?.imageUrl,
      imageHint: "trash can",
      reporter: mockUsers[2],
      createdAt: new Date('2023-10-25T14:30:00Z'),
    },
    {
      id: '3',
      title: 'Streetlight out on 5th and Elm',
      description: 'The streetlight at the corner of 5th Avenue and Elm Street is not working. It makes the intersection very dark and unsafe at night.',
      status: 'Resolved',
      category: 'Streetlight Outage',
      priority: 'High',
      department: 'Transportation',
      location: { lat: 41.8781, lng: -87.6298 },
      address: '5th Ave & Elm St, Chicago, IL',
      imageUrl: getImage('issue-streetlight')?.imageUrl,
      imageHint: "streetlight broken",
      reporter: mockUsers[3],
      createdAt: new Date('2023-10-24T20:00:00Z'),
    },
    {
      id: '4',
      title: 'Graffiti on library wall',
      description: 'Someone has spray-painted graffiti on the north wall of the public library. It should be cleaned off.',
      status: 'Resolved',
      category: 'Graffiti',
      priority: 'Low',
      department: 'Public Works',
      location: { lat: 29.7604, lng: -95.3698 },
      address: '789 Library Ln, Houston, TX',
      imageUrl: getImage('issue-graffiti')?.imageUrl,
      imageHint: "graffiti wall",
      reporter: currentUser,
      createdAt: new Date('2023-10-22T09:15:00Z'),
    },
  ];
