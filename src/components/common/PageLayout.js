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
      <main className="container mx-auto px-2 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
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