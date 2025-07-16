import React, { useState } from 'react';

const initialTrash = [
  { id: 1, name: 'Old Resume.pdf', type: 'document' },
  { id: 2, name: 'Unused Project', type: 'folder' },
  { id: 3, name: 'Screenshot.png', type: 'image' },
];

const Trash = () => {
  const [items, setItems] = useState(initialTrash);

  const handleRestore = (id) => {
    setItems(items.filter(item => item.id !== id));
    // In a real app, restore logic would go here
  };

  const handleEmpty = () => {
    setItems([]);
    // In a real app, empty logic would go here
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="text-white/60 text-center mt-8">Trash is empty.</div>
        ) : (
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.id} className="flex items-center justify-between bg-glass backdrop-blur-md rounded-lg p-3 border border-white/10 shadow-glass">
                <span className="text-white/80 font-mono">
                  {item.type === 'folder' ? '📁' : item.type === 'image' ? '🖼️' : '📄'} {item.name}
                </span>
                <button
                  className="px-3 py-1 rounded bg-accent/20 text-accent hover:bg-accent/40 transition text-xs font-semibold"
                  onClick={() => handleRestore(item.id)}
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="pt-4 flex justify-end">
        <button
          className="px-4 py-2 rounded bg-red-500/80 text-white hover:bg-red-600 transition font-semibold shadow-glass disabled:opacity-40"
          onClick={handleEmpty}
          disabled={items.length === 0}
        >
          Empty Trash
        </button>
      </div>
    </div>
  );
};

export default Trash; 