import {create} from 'zustand';
import {ContentType, PaymentType, UserType} from '@/models';

type  MainState = {
  
  loggedIn: boolean;
  login: () => void;
  logout: () => void;

  contents: ContentType[] | null;
  contentsLoading: boolean;

  users: UserType[] | null;
  usersLoading: boolean;
  usersNotificationCounter: number;

  payments: PaymentType[] | null;
  paymentsLoading: boolean;
  paymentsNotificationCounter: number;

  initializeApp: () => void;
}

const useMainStore = create<MainState>((set) => ({
  loggedIn: JSON.parse(localStorage.getItem('loggedIn') || 'false'),
  login: () => {
    localStorage.setItem('loggedIn', 'true');
    set({ loggedIn: true });
  },
  logout: () => {
    localStorage.removeItem('loggedIn');
    set({ 
      loggedIn: false,
      contents: null,
    });
  },

  contents: null,
  contentsLoading: false,

  users: null,
  usersLoading: false,
  usersNotificationCounter: 3,

  payments: null,
  paymentsLoading: false,
  paymentsNotificationCounter: 2,

  initializeApp: () => {
    if (localStorage.getItem('loggedIn')) {
      set({ loggedIn: true });
    }
  }
}));


export default useMainStore;
