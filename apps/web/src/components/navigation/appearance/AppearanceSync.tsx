'use client';

import { useEffect } from 'react';
import { applyAppearance } from '@/lib/appearance';

export default function AppearanceSync() {
  useEffect(() => {
    applyAppearance();
  }, []);

  return null;
}
