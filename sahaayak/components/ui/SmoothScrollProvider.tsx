'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { ReactNode } from 'react';

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root>
      {children as any}
    </ReactLenis>
  );
}
