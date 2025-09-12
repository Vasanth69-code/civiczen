
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Issue, IssueStatus } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


type IssueContextType = {
  issues: Issue[];
  loading: boolean;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt'>) => Promise<string>;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => Promise<void>;
  updateIssue: (issueId: string, updates: Partial<Omit<Issue, 'id'>>) => Promise<void>;
};

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider = ({ children }: { children: ReactNode }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const issuesCollection = collection(db, 'issues');
    const q = query(issuesCollection, orderBy('createdAt', 'desc'));
    
    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Issue));
      setIssues(issuesList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching issues from Firestore:", error);
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: "Could not load issue reports from the database."
      });
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);

  const addIssue = async (issue: Omit<Issue, 'id' | 'createdAt'>) => {
    try {
      const issuesCollection = collection(db, 'issues');
      const newIssueWithTimestamp = {
        ...issue,
        createdAt: Timestamp.now(),
      }
      const docRef = await addDoc(issuesCollection, newIssueWithTimestamp);
      return docRef.id;
    } catch (error) {
        console.error("Error adding issue to Firestore: ", error);
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: "Could not save the new issue report."
        });
        // Re-throw the error to be caught by the calling function
        throw new Error("Failed to add issue to Firestore.");
    }
  };

  const updateIssue = async (issueId: string, updates: Partial<Omit<Issue, 'id'>>) => {
    const issueDocRef = doc(db, 'issues', issueId);
    try {
      await updateDoc(issueDocRef, updates);
      // No need to manually update state, onSnapshot will handle it
    } catch (error) {
      console.error("Error updating issue: ", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save changes to the issue."
      });
    }
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
