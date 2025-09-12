
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUsers, currentUser as defaultUser } from '@/lib/placeholder-data';
import { User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

type UserContextType = {
  user: User;
  users: User[];
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        // Sort by points for ranking
        usersList.sort((a, b) => b.points - a.points);
        const rankedUsers = usersList.map((user, index) => ({...user, rank: index + 1}));
        setUsers(rankedUsers);

        // Find the current user in the fetched list, if they exist
        const current = rankedUsers.find(u => u.id === defaultUser.id) || defaultUser;
        setUser(current);

      } catch (error) {
        console.error("Error fetching users from Firestore:", error);
        // Fallback to mock data on error
        setUsers(mockUsers);
        setUser(defaultUser);
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
