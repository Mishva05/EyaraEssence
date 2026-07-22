import React from 'react';

export default function QuickActions({ actions = [], onActionClick }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 py-1 px-1">
      {actions.map((act) => (
        <button
          key={act}
          onClick={() => onActionClick(act)}
          className="px-2.5 py-1.5 bg-brand-cream/80 hover:bg-brand-rose/5 border border-brand-beige/50 text-[10px] font-bold text-brand-rose rounded-full transition-colors cursor-pointer hover:border-brand-rose/30 focus:outline-none"
        >
          {act}
        </button>
      ))}
    </div>
  );
}
