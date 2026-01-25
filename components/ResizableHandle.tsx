'use client';

import { useState, useEffect } from 'react';

interface ResizableHandleProps {
  onResize: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  currentWidth: number;
}

export default function ResizableHandle({ 
  onResize, 
  minWidth = 200, 
  maxWidth = 800,
  currentWidth 
}: ResizableHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(currentWidth);

  useEffect(() => {
    if (!isDragging) {
      setStartWidth(currentWidth);
    }
  }, [currentWidth, isDragging]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const diff = e.clientX - startX;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + diff));
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, startX, startWidth, minWidth, maxWidth, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartWidth(currentWidth);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute right-0 top-0 bottom-0 w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors z-10 group ${
        isDragging ? 'bg-blue-500' : ''
      }`}
      style={{ touchAction: 'none' }}
      role="separator"
      aria-label="Resize sidebar"
      aria-orientation="vertical"
    >
      {/* Wider hit area for easier dragging */}
      <div className="absolute inset-y-0 -left-2 -right-2" />
      {/* Visual indicator */}
      <div className="absolute inset-y-0 left-0 w-0.5 bg-gray-300 group-hover:bg-blue-400 transition-colors" />
    </div>
  );
}
