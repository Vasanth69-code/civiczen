
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUsers, currentUser as defaultUser } from '@/lib/placeholder-data';
import { User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';

type UserContextType = {
  user: User;
  users: User[];
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Function to seed the database with mock users if it's empty
const seedUsers = async () => {
    const usersCollection = collection(db, 'users');
    const promises = mockUsers.map(user => {
        const { id, ...userData } = user; // Separate id from the rest of the data
        return addDoc(usersCollection, userData);
    });
    await Promise.all(promises);
    console.log("Firestore 'users' collection seeded with mock data.");
};


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('points', 'desc'));
        const usersSnapshot = await getDocs(q);
        
        let usersList: User[] = [];

        if (usersSnapshot.empty) {
            console.warn("User collection is empty. Seeding with mock data.");
            await seedUsers();
            // Re-fetch after seeding
            const newSnapshot = await getDocs(q);
            usersList = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        } else {
            usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        }

        const rankedUsers = usersList.map((user, index) => ({...user, rank: index + 1}));
        setUsers(rankedUsers);

        // Find the current user based on a stable identifier (e.g., name in this mock scenario)
        const current = rankedUsers.find(u => u.name === defaultUser.name) || {...defaultUser, rank: rankedUsers.length + 1};
        setUser(current);

      } catch (error) {
        console.error("Error fetching users from Firestore:", error);
        // Fallback to mock data on error
        const sortedMockUsers = [...mockUsers].sort((a, b) => b.points - a.points);
        const rankedMockUsers = sortedMockUsers.map((u, i) => ({...u, rank: i + 1}));
        setUsers(rankedMockUsers);
        setUser(rankedMockUsers.find(u => u.id === defaultUser.id) || defaultUser);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ user, users, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
