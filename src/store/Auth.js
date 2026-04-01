import { create } from 'zustand';
import { account } from '@/lib/appwriteConfig';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAppReady: false, // Tells the Splash Screen when to drop

  // 1. Check if a session already exists on load
  checkSession: async () => {
    try {
      const currentAccount = await account.get();
      set({ user: currentAccount, isAuthenticated: true, isAppReady: true });
    } catch (error) {
      // 401 Unauthorized means they just aren't logged in. Perfectly normal.
      set({ user: null, isAuthenticated: false, isAppReady: true });
    }
  },

  // 2. We will call this from our TanStack Form later!
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  
  // 3. Clear state on logout
  logout: async () => {
    try {
      await account.deleteSession('current');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));

export default useAuthStore;