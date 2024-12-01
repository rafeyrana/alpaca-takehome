'use client';

import { useState } from 'react';
import SessionModal from '../components/SessionModal/SessionModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen p-8 bg-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-[rgb(37,150,190)] mb-8">Get Started</h1>
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-[rgb(37,150,190)] text-white rounded-md hover:bg-[rgb(27,140,180)] transition-colors shadow-sm"
        suppressHydrationWarning={true}
      >
        New User Session
      </button>

      <SessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
