import React from 'react'
import { Loader2Icon } from 'lucide-react'
export default function loading() {
  return (
    <div className='flex justify-center items-center h-screen'>
        <Loader2Icon className='w-10 h-10 animate-spin text-[#5b6949]' />
    </div>
  )
}
