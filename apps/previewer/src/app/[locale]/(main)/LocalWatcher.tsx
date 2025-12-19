'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LocalWatcher() {
  const router = useRouter();

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3100');

    socket.onmessage = (event) => {
      if (event.data === 'refresh') {
        console.log('🔄 File change detected, refreshing data...');
        router.refresh();
      }
    };

    socket.onerror = () => console.log('WS Watcher not running.');

    return () => socket.close();
  }, []);

  return null;
}