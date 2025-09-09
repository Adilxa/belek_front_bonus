"use client"
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import React from 'react'


interface Props {
    children: React.ReactNode
}

const queryClient = new QueryClient()

const Provider: React.FC<Props> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider >
    )
}


export default Provider