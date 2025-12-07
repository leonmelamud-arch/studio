
"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import type { Participant } from '@/types';
import { collection, query, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface ParticipantsContextType {
  allParticipants: Participant[];
  setAllParticipants: Dispatch<SetStateAction<Participant[]>>;
  availableParticipants: Participant[];
  setAvailableParticipants: Dispatch<SetStateAction<Participant[]>>;
  loading: boolean;
}

const ParticipantsContext = createContext<ParticipantsContextType | undefined>(undefined);

export function ParticipantsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) {
      // Firestore might not be available on first render, wait for it.
      return;
    }

    setLoading(true);
    const participantsQuery = query(collection(firestore, 'participants'));

    const unsubscribe: Unsubscribe = onSnapshot(
      participantsQuery,
      (snapshot) => {
        const firestoreParticipants = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Participant));
        
        const sortedParticipants = [...firestoreParticipants].sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        setAllParticipants(prevAll => {
          // Only update available participants if all participants list was empty before
          if (prevAll.length === 0) {
            setAvailableParticipants(sortedParticipants);
          }
          return sortedParticipants;
        });

        setLoading(false);
      },
      (error) => {
        console.error("Error fetching participants:", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [firestore]);


  return (
    <ParticipantsContext.Provider value={{ allParticipants, setAllParticipants, availableParticipants, setAvailableParticipants, loading }}>
      {children}
    </ParticipantsContext.Provider>
  );
}

export function useParticipants() {
  const context = useContext(ParticipantsContext);
  if (context === undefined) {
    throw new Error('useParticipants must be used within a ParticipantsProvider');
  }
  return context;
}
