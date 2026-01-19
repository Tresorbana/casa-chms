
import os
import re
from bs4 import BeautifulSoup

# Define the standard sidebar template
# Note: We will replace the 'active' class dynamically
SIDEBAR_TEMPLATE = """
<aside class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-colors duration-200">
    <div class="p-6">
        <div class="flex items-center gap-3">
            <img alt="Casa Hotel Logo" class="h-10 w-10 object-contain" src="logo.png"/>
            <div>
                <h1 class="font-bold text-xl tracking-tight text-slate-800 dark:text-white">Casa Hotel</h1>
                <p class="text-[10px] uppercase tracking-widest text-secondary font-bold">Management System</p>
            </div>
        </div>
    </div>
    <nav class="flex-1 mt-4 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="dashboard_1.html">
            <span class="material-icons-outlined">dashboard</span>
            Dashboard
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="bookings_1.html">
            <span class="material-icons-outlined">calendar_today</span>
            Bookings
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="room_timeline.html">
            <span class="material-icons-outlined">hotel</span>
            Room Status
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="events.html">
            <span class="material-icons-outlined">event</span>
            Events
        </a>
        <div class="pt-4 pb-2">
            <p class="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Operations</p>
        </div>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="pos_restaurant_1.html">
            <span class="material-icons-outlined">restaurant</span>
            Restaurant POS
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="inventory.html">
            <span class="material-icons-outlined">inventory_2</span>
            Inventory
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="checkout.html">
            <span class="material-icons-outlined">receipt_long</span>
            Checkout
        </a>
        <div class="pt-4 pb-2">
            <p class="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin</p>
        </div>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="reports_1.html">
            <span class="material-icons-outlined">assessment</span>
            Reports
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="cms_content.html">
            <span class="material-icons-outlined">language</span>
            Website CMS
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="cms_requests.html">
            <span class="material-icons-outlined">inbox</span>
            Web Requests
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" href="settings_1.html">
            <span class="material-icons-outlined">settings</span>
            Settings
        </a>
    </nav>
    <div class="p-6 border-t border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-3 mb-4">
            <img alt="Admin user avatar" class="h-10 w-10 rounded-full object-contain bg-slate-100" src="logo.png"/>
            <div>
                <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Alex Rivera</p>
                <p class="text-xs text-slate-500">General Manager</p>
            </div>
        </div>
        <button class="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-primary transition-colors" onclick="window.toggleTheme()">
            <span class="material-icons-outlined text-sm">dark_mode</span>
            Switch Theme
        </button>
    </div>
</aside>
"""

ACTIVE_CLASS = "bg-primary/10 text-primary font-medium shadow-sm"
INACTIVE_CLASS = "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"

FILE_MAPPING = {
    'dashboard': 'dashboard_1.html',
    'bookings': 'bookings_1.html',
    'room_timeline': 'room_timeline.html',
    'events': 'events.html',
    'pos_restaurant': 'pos_restaurant_1.html',
    'inventory': 'inventory.html',
    'checkout': 'checkout.html',
    'reports': 'reports_1.html',
    'cms_content': 'cms_content.html',
    'cms_requests': 'cms_requests.html',
    'settings': 'settings_1.html'
}

def get_active_link(filename):
    for key, link in FILE_MAPPING.items():
        if key in filename:
            return link
    return None

def process_file(filepath):
    filename = os.path.basename(filepath)
    if filename in ['login.html', 'move_files.py', 'refactor_app.py', 'unify_layout.py', 'check_structure.py', 'update_links.py', 'final_polish.py', 'invoice_preview.html']:
        return

    print(f"Processing {filename}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    # 1. Update/Insert Sidebar
    active_link = get_active_link(filename)
    
    # Create new sidebar soup
    new_sidebar_soup = BeautifulSoup(SIDEBAR_TEMPLATE, 'html.parser')
    
    # Set active state
    if active_link:
        for a in new_sidebar_soup.find_all('a'):
            if a.get('href') == active_link:
                a['class'] = f"flex items-center gap-3 px-4 py-3 rounded-xl transition-all {ACTIVE_CLASS}"
            else:
                a['class'] = f"flex items-center gap-3 px-4 py-3 rounded-xl transition-all {INACTIVE_CLASS}"

    # Replace or Insert
    existing_aside = soup.find('aside')
    if existing_aside:
        existing_aside.replace_with(new_sidebar_soup.aside)
    else:
        # Insert at beginning of body
        if soup.body:
            soup.body.insert(0, new_sidebar_soup.aside)

    # 2. Remove/Consolidate Top Navbar
    # Find headers that are direct children of body or outside main
    # We look for headers that contain "logo" or nav links
    headers = soup.find_all('header')
    for header in headers:
        # Check if this header is likely a top navbar (contains logo or nav)
        # and is NOT inside main (we assume main has class ml-64 or tag main)
        parent_main = header.find_parent('main')
        if parent_main:
            continue # Skip headers inside main

        # It's a top navbar. We want to remove it, but save unique content.
        print(f"  Found top navbar in {filename}. checking for unique content...")
        
        unique_content = []
        
        # Check for buttons (like Print, Download, Shift info)
        # We ignore buttons that toggle dark mode or are menu toggles
        buttons = header.find_all('button')
        for btn in buttons:
            btn_text = btn.get_text().strip().lower()
            onclick = btn.get('onclick', '')
            if 'dark' in btn_text or 'theme' in btn_text or 'dark' in str(onclick) or 'menu' in btn_text:
                continue
            unique_content.append(btn)
            
        # Check for specific shift info text blocks (like in pos)
        # This is a bit heuristic. We look for divs with text that isn't nav links.
        # For simplicity, let's look for specific classes or structure
        shift_info = header.find('div', class_=lambda x: x and 'text-right' in x) # Heuristic for pos_restaurant
        if shift_info:
             unique_content.append(shift_info)

        # Move unique content to the top of main
        main_tag = soup.find('main')
        if main_tag and unique_content:
            print(f"  Moving {len(unique_content)} unique items to main...")
            # Create a wrapper for rescued content
            wrapper = soup.new_tag('div')
            wrapper['class'] = "flex justify-end gap-4 mb-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800"
            for item in unique_content:
                wrapper.append(item)
            
            # Insert at top of main
            main_tag.insert(0, wrapper)

        # Remove the header
        header.decompose()

    # 3. Ensure Main has ml-64
    main = soup.find('main')
    if main:
        classes = main.get('class', [])
        if 'ml-64' not in classes:
            classes.append('ml-64')
            main['class'] = classes
    
    # 4. Remove duplicate dark mode scripts or styles if any
    # (Optional, but good for cleanup)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))

# Run for all html files
for file in os.listdir('.'):
    if file.endswith('.html'):
        process_file(file)
