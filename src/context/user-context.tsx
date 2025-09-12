
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUsers, currentUser as defaultUser } from '@/lib/placeholder-data';
import { User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

type UserContextType = {
  user: User;
  users: User[];
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('points', 'desc'));
        const usersSnapshot = await getDocs(q);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

        const rankedUsers = usersList.map((user, index) => ({...user, rank: index + 1}));
        setUsers(rankedUsers);

        // Find the current user in the fetched list, if they exist
        const current = rankedUsers.find(u => u.id === defaultUser.id) || defaultUser;
        setUser(current);

      } catch (error) {
        console.error("Error fetching users from Firestore:", error);
        // On error, use mock data but ensure ranking is correct
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
