import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import { queryClient } from '../utils/queryClient';

const QueryProvider = ({children}) => {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
        {import.meta.env.VITE_ENV === "dev" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    );
}

export default QueryProvider;