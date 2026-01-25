'use client';

import SearchSection from './SearchSection';
import ResizableHandle from './ResizableHandle';

interface SidebarProps {
  onSearch: (params: any) => void;
  isSearchDisabled?: boolean;
  width: number;
  onResize: (width: number) => void;
  onNavigate?: (view: 'search' | 'settings') => void;
  currentView?: 'search' | 'settings';
}

export default function Sidebar({
  onSearch,
  isSearchDisabled,
  width,
  onResize,
  onNavigate,
  currentView = 'search',
}: SidebarProps) {
  return (
    <div 
      className="bg-white border-r border-gray-200 flex flex-col h-screen overflow-y-auto relative flex-shrink-0"
      style={{ width: `${width}px` }}
    >
      <ResizableHandle 
        onResize={onResize} 
        minWidth={200} 
        maxWidth={800}
        currentWidth={width}
      />
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Menu</h2>
      </div>

      {/* Navigation Menu */}
      <div className="p-4 border-b border-gray-200 space-y-1">
        <button
          onClick={() => onNavigate?.('search')}
          className={`w-full px-4 py-2.5 text-left rounded-md transition-colors flex items-center gap-3 text-sm ${
            currentView === 'search'
              ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search Jobs</span>
        </button>
        <button
          onClick={() => onNavigate?.('settings')}
          className={`w-full px-4 py-2.5 text-left rounded-md transition-colors flex items-center gap-3 text-sm ${
            currentView === 'settings'
              ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </button>
      </div>

      {/* Search Section - Only show when Search Jobs is selected */}
      {currentView === 'search' && (
        <div className="flex-1 overflow-y-auto p-4">
          <SearchSection onSearch={onSearch} isDisabled={isSearchDisabled} />
        </div>
      )}
    </div>
  );
}
