
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Issue, IssueStatus } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


type IssueContextType = {
  issues: Issue[];
  loading: boolean;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt'>) => Promise<string | null>;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
  updateIssue: (issueId: string, updates: Partial<Issue>) => void;
};

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider = ({ children }: { children: ReactNode }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const issuesCollection = collection(db, 'issues');
      const q = query(issuesCollection, orderBy('createdAt', 'desc'));
      const issuesSnapshot = await getDocs(q);
      const issuesList = issuesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Issue));
      setIssues(issuesList);
    } catch (error) {
      console.error("Error fetching issues from Firestore:", error);
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: "Could not load issue reports from the database."
      })
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const addIssue = async (issue: Omit<Issue, 'id' | 'createdAt'>) => {
    try {
      const issuesCollection = collection(db, 'issues');
      const newIssueWithTimestamp = {
        ...issue,
        createdAt: Timestamp.now(),
      }
      const docRef = await addDoc(issuesCollection, newIssueWithTimestamp);
      
      // Add new issue to the top of the list for immediate UI update
      setIssues(prevIssues => [{...newIssueWithTimestamp, id: docRef.id}, ...prevIssues]);
      
      return docRef.id;
    } catch (error) {
        console.error("Error adding issue to Firestore: ", error);
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: "Could not save the new issue report."
        });
        return null;
    }
  };

  const updateIssue = async (issueId: string, updates: Partial<Omit<Issue, 'id'>>) => {
    const issueDocRef = doc(db, 'issues', issueId);
    try {
      await updateDoc(issueDocRef, updates);
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.id === issueId ? { ...issue, ...updates, id: issue.id, createdAt: issue.createdAt } as Issue : issue
        )
      );
    } catch (error) {
      console.error("Error updating issue: ", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save changes to the issue."
      });
    }
  };
  
  const updateIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    updateIssue(issueId, { status: newStatus });
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
