import React from 'react';
import { Grid, Table2 } from 'lucide-react';

export const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onViewModeChange('table')}
        className={`px-4 py-2 rounded flex items-center gap-2
          ${viewMode === 'table' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
      >
        <Table2 className="w-5 h-5" />
        <span className="hidden sm:inline">테이블 뷰</span>
      </button>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`px-4 py-2 rounded flex items-center gap-2
          ${viewMode === 'grid' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
      >
        <Grid className="w-5 h-5" />
        <span className="hidden sm:inline">그리드 뷰</span>
      </button>
    </div>
  );
};