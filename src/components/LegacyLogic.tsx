
'use client';

import { useEffect, useState } from 'react';

export default function LegacyLogic() {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    content: '',
  });

  useEffect(() => {
    // Theme Logic
    const html = document.documentElement;
    
    // Check initial theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    // Define global toggleTheme
    window.toggleTheme = () => {
        html.classList.toggle('dark');
        if (html.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
    };

    // Modal Logic
    window.openModal = (title: string, contentHtml: string, onConfirm?: () => void) => {
        setModal({
            isOpen: true,
            title,
            content: contentHtml,
            onConfirm
        });
    };

    window.closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    // Stubs for other functions - mapped to generic modal for now
    window.openDetails = (arg: any) => {
        console.log('openDetails called', arg);
        window.openModal('Details', `<p>Details for ${arg}</p>`);
    };
    window.closeDetails = () => console.log('closeDetails called');
    
    window.openManageRoomModal = (arg: any) => {
        console.log('openManageRoomModal called', arg);
        window.openModal('Manage Room', '<p>Room management interface would appear here.</p>');
    };
    
    window.openAddUserModal = (arg: any) => {
        console.log('openAddUserModal called', arg);
        window.openModal('Add User', '<p>Add user form would appear here.</p>');
    };
    
    window.switchType = (type: string) => {
        console.log('switchType called', type);
        // Toggle logic for buttons would go here. 
        // Since we don't have access to the specific DOM elements easily from here, 
        // we might just log it or dispatch an event.
    };

    // Cleanup not really needed as this is a singleton layout component
  }, []);

  if (!modal.isOpen) return null;

  return (
    <div id="modal-overlay" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300" onClick={(e) => {
        if (e.target === e.currentTarget) window.closeModal();
    }}>
        <div id="modal-content" className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{modal.title}</h3>
                <button onClick={() => window.closeModal()} className="text-slate-400 hover:text-slate-500 transition-colors">
                    <span className="material-icons-outlined">close</span>
                </button>
            </div>
            <div className="p-6" dangerouslySetInnerHTML={{ __html: modal.content }} />
            <div className="p-6 pt-0 flex justify-end gap-3">
                <button onClick={() => window.closeModal()} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                {modal.onConfirm && (
                    <button 
                        onClick={() => {
                            modal.onConfirm?.();
                            window.closeModal();
                        }} 
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-opacity-90 rounded-lg shadow-sm transition-all transform active:scale-95"
                    >
                        Confirm
                    </button>
                )}
            </div>
        </div>
    </div>
  );
}
