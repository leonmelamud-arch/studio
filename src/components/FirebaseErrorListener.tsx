'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In a real app, you might want to log this to a service like Sentry.
      // For this example, we'll just throw it to make it visible in the Next.js overlay.
      console.error(
        'A Firestore permission error was caught by the global error listener:',
        error
      );
      // Throwing the error will make it visible in the Next.js development overlay
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.removeListener('permission-error', handlePermissionError);
    };
  }, []);

  return null; // This component does not render anything
}
