'use client'
import { Signpost } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

export const GoogleNavigate = ({address}: {address: string}) => {
    const router = useRouter();
    const handleNavigate = () => {
        router.push(`https://www.google.com/maps?q=${address}`);
    }
  return (
    <Signpost className="inline-block ml-2 mb-1 cursor-pointer" size={12} onClick={handleNavigate}/>
  )
}

