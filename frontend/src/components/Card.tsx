import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`glass-card p-6 bg-cardbg-light dark:bg-cardbg-dark ${className}`}>
      {children}
    </div>
  );
}
