import React from 'react';
import Header from './header';
import { ViewModeToggle } from './ViewModeToggle';

export const PageLayout = ({ 
  title, 
  viewMode, 
  onViewModeChange,
  rightContent,
  children 
}) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center space-x-4">
            {rightContent}
            <ViewModeToggle 
              viewMode={viewMode} 
              onViewModeChange={onViewModeChange} 
            />
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};