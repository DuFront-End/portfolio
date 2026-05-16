import { useEffect, useRef, useCallback } from 'react';

/**
 * useSmartPolling
 * A professional hook for real-time data fetching with:
 * 1. Visibility awareness (stops polling when tab is hidden)
 * 2. Exponential backoff (on 429 or network errors)
 * 3. Immediate re-fetch when tab becomes visible
 */
export const useSmartPolling = (
  fetchFn: () => Promise<any>,
  baseInterval: number = 10000,
  maxInterval: number = 60000
) => {
  const timerRef = useRef<any>(null);
  const retryCountRef = useRef(0);

  const executeFetch = useCallback(async () => {
    // Stop if tab is hidden
    if (document.hidden) return;

    try {
      const result = await fetchFn();
      
      // If result is a response object and status is 429
      if (result && result.status === 429) {
        retryCountRef.current++;
        const nextDelay = Math.min(maxInterval, baseInterval * Math.pow(2, retryCountRef.current - 1));
        console.warn(`[SmartPolling] Rate limited. Backing off for ${nextDelay / 1000}s...`);
        schedule(nextDelay);
        return;
      }

      // Success
      retryCountRef.current = 0;
      schedule(baseInterval);
    } catch (error) {
      retryCountRef.current++;
      const nextDelay = Math.min(maxInterval, baseInterval * Math.pow(2, retryCountRef.current - 1));
      console.error(`[SmartPolling] Fetch failed. Retrying in ${nextDelay / 1000}s...`, error);
      schedule(nextDelay);
    }
  }, [fetchFn, baseInterval, maxInterval]);

  const schedule = useCallback((ms: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(executeFetch, ms);
  }, [executeFetch]);

  useEffect(() => {
    executeFetch();

    const handleVisibility = () => {
      if (!document.hidden) {
        console.log('[SmartPolling] Tab visible. Syncing now...');
        executeFetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [executeFetch]);
};
