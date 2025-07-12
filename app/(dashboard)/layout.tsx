import React from 'react'
import { Navbar } from './_components/navbar'
import Sidebar from './_components/sidebar'

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='h-full' suppressHydrationWarning>
        {/* Header */}
        <header className='h-20 md:pl-56 fixed inset-y-0 w-full z-50'>
            <Navbar/>
        </header>

        {/* Sidebar */}
        <aside className='hidden md:flex w-56 h-full flex-col inset-y-0 fixed z-50'>
            <Sidebar/>
        </aside>
        
        {/* Main Content */}
        <main className='md:pl-56 h-full pt-20'>
            {children}
        </main>
    </div>
  )
}

export default DashboardLayout