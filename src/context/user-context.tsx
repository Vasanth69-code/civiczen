
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUsers, currentUser as defaultUser } from '@/lib/placeholder-data';
import { User } from '@/lib/types';

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
    const sortedMockUsers = [...mockUsers].sort((a, b) => b.points - a.points);
    const rankedMockUsers = sortedMockUsers.map((u, i) => ({...u, rank: i + 1}));
    setUsers(rankedMockUsers);
    const currentUserData = rankedMockUsers.find(u => u.id === defaultUser.id) || defaultUser;
    setUser(currentUserData);
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
