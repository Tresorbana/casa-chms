// common.js - Handles global functionality for Casa Hotel Management System

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark Mode Persistence and Toggle
    const html = document.documentElement;
    const themeToggleBtns = document.querySelectorAll('[onclick*="toggle(\'dark\')"], .theme-toggle');

    // Check localStorage
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    // Override existing toggle buttons or attach new listeners
    // Note: Most HTML files have inline onclick="document.documentElement.classList.toggle('dark')". 
    // We should intercept this to save preference.
    
    // We can replace the global toggle function if needed, or just attach a listener to buttons
    window.toggleTheme = function() {
        html.classList.toggle('dark');
        if (html.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
    };

    // Find existing toggle buttons and update their onclick
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.innerHTML.includes('dark_mode') || btn.getAttribute('onclick')?.includes("classList.toggle('dark')")) {
            btn.onclick = (e) => {
                e.preventDefault();
                window.toggleTheme();
            };
            btn.classList.add('transition-transform', 'active:scale-95'); // Add animation
        }
    });


    // 2. Modal Management System
    // Create a generic modal container if it doesn't exist
    if (!document.getElementById('modal-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] hidden opacity-0 transition-opacity duration-300 flex items-center justify-center p-4';
        overlay.innerHTML = `
            <div id="modal-content" class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg transform scale-95 transition-all duration-300 opacity-0 border border-slate-200 dark:border-slate-800">
                <!-- Dynamic Content -->
            </div>
        `;
        document.body.appendChild(overlay);

        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    window.openModal = function(title, contentHtml, onConfirm) {
        const overlay = document.getElementById('modal-overlay');
        const container = document.getElementById('modal-content');
        
        container.innerHTML = `
            <div class="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">${title}</h3>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-500 transition-colors">
                    <span class="material-icons-outlined">close</span>
                </button>
            </div>
            <div class="p-6">
                ${contentHtml}
            </div>
            <div class="p-6 pt-0 flex justify-end gap-3">
                <button onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button id="modal-confirm-btn" class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-opacity-90 rounded-lg shadow-sm transition-all transform active:scale-95">Confirm</button>
            </div>
        `;

        const confirmBtn = document.getElementById('modal-confirm-btn');
        if (onConfirm) {
            confirmBtn.onclick = () => {
                onConfirm();
                closeModal();
            };
        } else {
            confirmBtn.style.display = 'none';
        }

        // Show
        overlay.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            container.classList.remove('scale-95', 'opacity-0');
            container.classList.add('scale-100', 'opacity-100');
        });
    };

    window.closeModal = function() {
        const overlay = document.getElementById('modal-overlay');
        const container = document.getElementById('modal-content');
        
        overlay.classList.add('opacity-0');
        container.classList.remove('scale-100', 'opacity-100');
        container.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    };
});

// 3. Helper functions for specific pages
function openAddUserModal() {
    const formHtml = `
        <form id="add-user-form" class="space-y-4">
            <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input type="text" class="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm" placeholder="e.g. John Doe">
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Email Address</label>
                <input type="email" class="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm" placeholder="john@casahotel.com">
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Role</label>
                <select class="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm">
                    <option>Front Desk Agent</option>
                    <option>Manager</option>
                    <option>Housekeeping</option>
                    <option>Admin</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Password</label>
                <input type="password" class="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm" placeholder="••••••••">
            </div>
        </form>
    `;
    openModal('Create New User', formHtml, () => {
        // Mock success
        const btn = document.querySelector('button[onclick="openAddUserModal()"]');
        if(btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-icons-outlined animate-spin">refresh</span> Creating...';
            setTimeout(() => {
                btn.innerHTML = originalText;
                alert('User created successfully!');
            }, 1000);
        }
    });
}

function openManageRoomModal() {
    const formHtml = `
        <form class="space-y-4">
             <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-500 mb-1">Room Number</label>
                    <input type="text" class="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm" placeholder="101">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-500 mb-1">Type</label>
                    <select class="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm">
                        <option>Deluxe Suite</option>
                        <option>Standard King</option>
                        <option>Twin Room</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <div class="flex gap-4">
                    <label class="flex items-center gap-2 text-sm"><input type="radio" name="status" class="text-secondary focus:ring-secondary" checked> Available</label>
                    <label class="flex items-center gap-2 text-sm"><input type="radio" name="status" class="text-red-500 focus:ring-red-500"> Occupied</label>
                    <label class="flex items-center gap-2 text-sm"><input type="radio" name="status" class="text-blue-500 focus:ring-blue-500"> Cleaning</label>
                </div>
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-500 mb-1">Notes</label>
                <textarea class="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm" rows="3"></textarea>
            </div>
        </form>
    `;
    openModal('Manage Room Status', formHtml, () => {
        alert('Room status updated!');
    });
}
