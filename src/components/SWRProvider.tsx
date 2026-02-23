'use client';
import { SWRConfig } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SWRProvider({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                fetcher,
                dedupingInterval: 10000,   // de-dup identical requests within 10s
                revalidateOnFocus: false,  // don't re-fetch when tab regains focus (reduces noise)
                errorRetryCount: 2,        // only retry twice on error
                keepPreviousData: true,    // keep stale data while revalidating (no blank flash)
            }}
        >
            {children}
        </SWRConfig>
    );
}
