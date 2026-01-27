'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function CmsContent() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
<span className="material-icons-outlined text-white">hotel</span>
</div>
<div>
<h1 className="font-bold text-lg leading-none">Casa Hotel</h1>
<p className="text-xs text-slate-500 dark:text-slate-400">Content Management System</p>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => { document.documentElement.classList.toggle('dark') }}>
<span className="material-icons-outlined text-slate-600 dark:text-slate-300">dark_mode</span>
</button>
<div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
<div className="flex items-center gap-3">
<div className="text-right">
<p className="text-sm font-medium">Admin User</p>
<p className="text-xs text-slate-500">Website Manager</p>
</div>
<div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-white font-bold">A</div>
</div>
</div>
</nav>
<main className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6 ml-64 min-h-screen">
<header className="flex justify-between items-center mb-10 px-8 pt-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">Editable Sections</h2>
<p className="text-slate-500 mt-1">Manage your cms here.</p>
</div>
<div className="flex items-center gap-4">
<div className="relative">
<span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-primary focus:border-primary text-sm w-64 transition-all" placeholder="Search..." type="text"/>
</div>
<button className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg relative transition-colors">
<span className="material-icons-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
</button>
</div>
</header>
<section className="col-span-12 lg:col-span-5 xl:col-span-6 space-y-6">
<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
<h2 className="font-bold">Editable Sections</h2>
<span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium">All Saved</span>
</div>
<div className="divide-y divide-slate-100 dark:divide-slate-800">
<div className="p-5 flex items-start justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
<div className="flex gap-4">
<div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary">
<span className="material-icons-outlined">photo_library</span>
</div>
<div>
<h3 className="font-semibold text-slate-800 dark:text-slate-100">Home Hero Image</h3>
<p className="text-sm text-slate-500 dark:text-slate-400">Manage the main landing banner and slogan text.</p>
<div className="mt-2 flex items-center gap-2">
<span className="text-[10px] uppercase font-bold text-slate-400">Last updated: 2 hours ago</span>
</div>
</div>
</div>
<button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<span className="material-icons-outlined text-[18px]">edit</span>
                            Edit
                        </button>
</div>
<div className="p-5 flex items-start justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
<div className="flex gap-4">
<div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
<span className="material-icons-outlined">bed</span>
</div>
<div>
<h3 className="font-semibold text-slate-800 dark:text-slate-100">Room Descriptions</h3>
<p className="text-sm text-slate-500 dark:text-slate-400">Edit titles, amenities, and pricing for luxury suites.</p>
<div className="mt-2 flex items-center gap-2">
<span className="text-[10px] uppercase font-bold text-slate-400">6 rooms active</span>
</div>
</div>
</div>
<button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<span className="material-icons-outlined text-[18px]">edit</span>
                            Edit
                        </button>
</div>
<div className="p-5 flex items-start justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
<div className="flex gap-4">
<div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-secondary">
<span className="material-icons-outlined">restaurant_menu</span>
</div>
<div>
<h3 className="font-semibold text-slate-800 dark:text-slate-100">Menu Highlights</h3>
<p className="text-sm text-slate-500 dark:text-slate-400">Update seasonal specials and restaurant gallery.</p>
<div className="mt-2 flex items-center gap-2">
<span className="text-[10px] uppercase font-bold text-slate-400">12 items listed</span>
</div>
</div>
</div>
<button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<span className="material-icons-outlined text-[18px]">edit</span>
                            Edit
                        </button>
</div>
<div className="p-5 flex items-start justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
<div className="flex gap-4">
<div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
<span className="material-icons-outlined">info</span>
</div>
<div>
<h3 className="font-semibold text-slate-800 dark:text-slate-100">About Us</h3>
<p className="text-sm text-slate-500 dark:text-slate-400">History of Casa Hotel and contact information.</p>
<div className="mt-2 flex items-center gap-2">
<span className="text-[10px] uppercase font-bold text-slate-400">Draft pending</span>
</div>
</div>
</div>
<button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<span className="material-icons-outlined text-[18px]">edit</span>
                            Edit
                        </button>
</div>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
<div className="flex items-center justify-between mb-6">
<h3 className="font-bold flex items-center gap-2">
<span className="material-icons-outlined text-primary">edit_note</span>
                        Editing: Home Hero Image
                    </h3>
<button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
<span className="material-icons-outlined">close</span>
</button>
</div>
<div className="space-y-4">
<div>
<label className="block text-sm font-semibold mb-1.5">Hero Title</label>
<input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary" type="text" value="Experience Luxury in the Heart of the City"/>
</div>
<div>
<label className="block text-sm font-semibold mb-1.5">Hero Slogan</label>
<textarea className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary" rows={3}>Your home away from home. Discover a sanctuary of comfort and elegance at Casa Hotel.</textarea>
</div>
<div>
<label className="block text-sm font-semibold mb-1.5">Background Image</label>
<div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/50">
<span className="material-icons-outlined text-4xl text-slate-400 mb-2">cloud_upload</span>
<p className="text-sm text-slate-500">Drag and drop or <span className="text-primary font-medium cursor-pointer">browse</span></p>
<p className="text-xs text-slate-400 mt-1">Recommended size: 1920x1080px (Max 5MB)</p>
</div>
</div>
<div className="flex gap-3 pt-2">
<button className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg">Save Draft</button>
<button className="px-6 border border-slate-200 dark:border-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
</div>
</div>
</div>
</section>
<section className="col-span-12 lg:col-span-4 space-y-4">
<div className="flex items-center justify-between px-1">
<h2 className="font-bold flex items-center gap-2">
<span className="material-icons-outlined text-secondary">visibility</span>
                    Live Preview
                </h2>
<div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
<button className="p-1.5 bg-white dark:bg-slate-700 rounded shadow-sm">
<span className="material-icons-outlined text-[18px]">desktop_windows</span>
</button>
<button className="p-1.5 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded transition-all">
<span className="material-icons-outlined text-[18px] text-slate-500">smartphone</span>
</button>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden sticky top-24 h-[calc(100vh-140px)]">
<div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center gap-4">
<div className="flex gap-1.5">
<div className="w-3 h-3 rounded-full bg-red-400"></div>
<div className="w-3 h-3 rounded-full bg-yellow-400"></div>
<div className="w-3 h-3 rounded-full bg-green-400"></div>
</div>
<div className="flex-1 bg-white dark:bg-slate-900 rounded-md py-1 px-3 text-[10px] text-slate-400 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
<span className="material-icons-outlined text-[12px]">lock</span>
                        www.casahotel.com/preview-mode
                    </div>
</div>
<div className="overflow-y-auto h-full custom-scrollbar">
<div className="relative h-64 bg-slate-300 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
<img alt="Hotel Luxury Lobby" className="absolute inset-0 w-full h-full object-cover opacity-60 h-10 object-contain" src="logo.png"/>
<div className="relative z-10 text-center px-8">
<h4 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Experience Luxury in the Heart of the City</h4>
<p className="text-xs text-white/90 max-w-xs mx-auto drop-shadow-md">Your home away from home. Discover a sanctuary of comfort and elegance at Casa Hotel.</p>
<button className="mt-4 px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-wider">Book Now</button>
</div>
</div>
<div className="px-6 py-4 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
<div className="flex items-center gap-1">
<span className="material-icons-outlined text-primary text-sm">hotel</span>
<span className="font-bold text-xs">CASA HOTEL</span>
</div>
<div className="flex gap-4 text-[10px] font-medium text-slate-400">
<span>Rooms</span>
<span>Dining</span>
<span>Gallery</span>
<span>Contact</span>
</div>
</div>
<div className="p-6">
<h5 className="text-center font-bold text-sm mb-4">Our Luxury Suites</h5>
<div className="grid grid-cols-2 gap-4">
<div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
<div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-md mb-2 overflow-hidden">
<img alt="Executive Suite" className="w-full h-full object-cover h-10 object-contain" src="logo.png"/>
</div>
<p className="text-[10px] font-bold">Executive Suite</p>
<p className="text-[8px] text-slate-500">From $299/night</p>
</div>
<div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
<div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-md mb-2 overflow-hidden">
<img alt="Presidential Room" className="w-full h-full object-cover h-10 object-contain" src="logo.png"/>
</div>
<p className="text-[10px] font-bold">Deluxe Queen</p>
<p className="text-[8px] text-slate-500">From $199/night</p>
</div>
</div>
</div>
<div className="bg-slate-900 text-white p-6">
<div className="flex items-center gap-4">
<div className="flex-1">
<h5 className="text-sm font-bold mb-2 text-primary">Signature Dining</h5>
<p className="text-[9px] text-slate-300">Taste the finest Mediterranean cuisine prepared by our award-winning chefs.</p>
</div>
<div className="w-20 h-20 rounded-full border-2 border-primary overflow-hidden">
<img alt="Fine Dining" className="w-full h-full object-cover h-10 object-contain" src="logo.png"/>
</div>
</div>
</div>
<div className="p-6 text-center bg-slate-50 dark:bg-slate-800/50">
<p className="text-[8px] text-slate-400">© 2024 Casa Hotel &amp; Resorts. All Rights Reserved.</p>
</div>
</div>
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    Interactive Preview Mode
                </div>
</div>
</section>
</main>

    </div>
  );
}
