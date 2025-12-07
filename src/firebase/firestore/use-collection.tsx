
'use client';

import {
  onSnapshot,
  type CollectionReference,
  type Query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T extends { id: string }>(
  queryOrRef: Query | CollectionReference | null
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!queryOrRef) {
        setData(null);
        setLoading(false);
        return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      queryOrRef,
      (snapshot) => {
        const items = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as T)
        );
        setData(items);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching collection:', error);
        const path = 'path' in queryOrRef ? queryOrRef.path : 'unknown path';
        const permissionError = new FirestorePermissionError({
            path: path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setData(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // The queryOrRef object's stability should be managed by the calling component (e.g., with useMemo).
  }, [queryOrRef]); 

  return { data, loading };
}
