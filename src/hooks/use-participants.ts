
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Participant } from '@/types';
import {
  collection,
  query,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useParticipants() {
  const firestore = useFirestore();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the query to prevent re-creating it on every render.
  // This is a key part of preventing infinite loops.
  const participantsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'participants'));
  }, [firestore]);

  useEffect(() => {
    // If firestore isn't ready, don't do anything.
    if (!participantsQuery) {
      setLoading(!firestore); // If firestore is null, we are loading.
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe: Unsubscribe = onSnapshot(
      participantsQuery,
      (snapshot) => {
        const firestoreParticipants = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Participant)
        );

        setParticipants(firestoreParticipants);
        setLoading(false);
      },
      (err) => {
        console.error("useParticipants - Firestore Error:", err);
        setError(err);
        setLoading(false);
        // Also emit a more specific permission error if that's the cause
        const permissionError = new FirestorePermissionError({
          path: participantsQuery.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [participantsQuery, firestore]); // Dependency array ensures this only runs when the query or firestore instance changes.

  return { participants, loading, error };
}
