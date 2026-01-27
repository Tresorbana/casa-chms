
export {};

declare global {
  interface Window {
    openModal: (title: string, contentHtml: string, onConfirm?: () => void) => void;
    closeModal: () => void;
    toggleTheme: () => void;
    // Add other globals if needed
    openDetails: (arg?: any) => void;
    closeDetails: () => void;
    openManageRoomModal: (arg?: any) => void;
    openAddUserModal: (arg?: any) => void;
    switchType: (type: string) => void;
  }

  // Allow using these without window. prefix
  var openModal: (title: string, contentHtml: string, onConfirm?: () => void) => void;
  var closeModal: () => void;
  var toggleTheme: () => void;
  var openDetails: (arg?: any) => void;
  var closeDetails: () => void;
  var openManageRoomModal: (arg?: any) => void;
  var openAddUserModal: (arg?: any) => void;
  var switchType: (type: string) => void;
}
