
"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import type { Participant } from '@/types';
import { useParticipants as useParticipantsHook } from '@/hooks/use-participants';

interface ParticipantsContextType {
  allParticipants: Participant[];
  setAllParticipants: Dispatch<SetStateAction<Participant[]>>;
  availableParticipants: Participant[];
  setAvailableParticipants: Dispatch<SetStateAction<Participant[]>>;
  loading: boolean;
  error: Error | null;
}

const ParticipantsContext = createContext<ParticipantsContextType | undefined>(undefined);

export function ParticipantsProvider({ children }: { children: ReactNode }) {
  const { participants, loading, error } = useParticipantsHook();
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (participants) {
      // Sort participants once when they are loaded/updated
      const sortedParticipants = [...participants].sort((a, b) => a.displayName.localeCompare(b.displayName));
      
      setAllParticipants(prevAll => {
        // Simple way to check if it's the initial load
        if (prevAll.length === 0 && sortedParticipants.length > 0) {
          setAvailableParticipants(sortedParticipants);
        } else {
            // If not initial load, try to preserve the available list
            // This logic can be improved based on desired behavior on live-updates
            const updatedAvailable = sortedParticipants.filter(p => 
                availableParticipants.some(ap => ap.id === p.id)
            );
            if(updatedAvailable.length > 0) {
                setAvailableParticipants(updatedAvailable);
            } else {
                setAvailableParticipants(sortedParticipants);
            }
        }
        return sortedParticipants;
      });
    }
  }, [participants]);


  const value = {
    allParticipants,
    setAllParticipants,
    availableParticipants,
    setAvailableParticipants,
    loading,
    error,
  };

  return (
    <ParticipantsContext.Provider value={value}>
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
