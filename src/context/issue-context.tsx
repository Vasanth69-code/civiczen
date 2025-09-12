
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { mockIssues } from '@/lib/placeholder-data';
import { Issue, IssueStatus } from '@/lib/types';

type IssueContextType = {
  issues: Issue[];
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
};

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider = ({ children }: { children: ReactNode }) => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);

  const updateIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  return (
    <IssueContext.Provider value={{ issues, updateIssueStatus }}>
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
