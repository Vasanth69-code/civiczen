
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Issue, IssueStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { mockIssues } from '@/lib/placeholder-data';

type IssueContextType = {
  issues: Issue[];
  loading: boolean;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt'>) => Promise<string>;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => Promise<void>;
  updateIssue: (issueId: string, updates: Partial<Omit<Issue, 'id'>>) => Promise<void>;
};

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider = ({ children }: { children: ReactNode }) => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addIssue = async (issue: Omit<Issue, 'id' | 'createdAt'>) => {
    const newId = (Math.random() * 1000000).toString();
    const newIssue: Issue = {
      ...issue,
      id: newId,
      createdAt: new Date(),
    };
    
    setIssues(prevIssues => [newIssue, ...prevIssues]);
    return newId;
  };

  const updateIssue = async (issueId: string, updates: Partial<Omit<Issue, 'id'>>) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === issueId ? { ...issue, ...updates } : issue
      )
    );
  };
  
  const updateIssueStatus = async (issueId: string, newStatus: IssueStatus) => {
    await updateIssue(issueId, { status: newStatus });
  };

  return (
    <IssueContext.Provider value={{ issues, loading, addIssue, updateIssueStatus, updateIssue }}>
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};
