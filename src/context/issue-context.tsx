
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { mockIssues } from '@/lib/placeholder-data';
import { Issue, IssueStatus } from '@/lib/types';

type IssueContextType = {
  issues: Issue[];
  addIssue: (issue: Issue) => void;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
  updateIssue: (issueId: string, updates: Partial<Issue>) => void;
};

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider = ({ children }: { children: ReactNode }) => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);

  const addIssue = (issue: Issue) => {
    setIssues(prevIssues => [issue, ...prevIssues]);
  };

  const updateIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  const updateIssue = (issueId: string, updates: Partial<Issue>) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, ...updates } : issue
      )
    );
  };

  return (
    <IssueContext.Provider value={{ issues, addIssue, updateIssueStatus, updateIssue }}>
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

    

    