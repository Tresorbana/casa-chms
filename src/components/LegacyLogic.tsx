
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
        const html = document.documentElement;
        html.classList.remove('dark');
        html.classList.add('light');

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

        // Functional Stubs for downstream compatibility (without mock content)
        window.openDetails = () => { };
        window.closeDetails = () => { };
        window.openManageRoomModal = (id: string) => {
            window.location.href = `/checkout?roomId=${id}`;
        };
        window.openAddUserModal = () => {
            window.location.href = `/settings`;
        };
        window.switchType = () => { };
        window.toggleTheme = () => {
            console.warn("Theme switching is disabled in this version.");
        };

        // Cleanup not really needed as this is a singleton layout component
    }, []);

    if (!modal.isOpen) return null;

    return (
        <div id="modal-overlay" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300" onClick={(e) => {
            if (e.target === e.currentTarget) window.closeModal();
        }}>
            <div id="modal-content" className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 border border-slate-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">{modal.title}</h3>
                    <button onClick={() => window.closeModal()} className="text-slate-400 hover:text-slate-500 transition-colors">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>
                <div className="p-6" dangerouslySetInnerHTML={{ __html: modal.content }} />
                <div className="p-6 pt-0 flex justify-end gap-3">
                    <button onClick={() => window.closeModal()} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
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
