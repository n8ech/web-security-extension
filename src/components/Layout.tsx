import React from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="flex w-full h-full bg-white">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
