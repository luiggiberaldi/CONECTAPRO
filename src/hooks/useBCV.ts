import { create } from 'zustand';

interface BCVState {
  rate: number;
  lastUpdate: string;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  fetchRate: () => Promise<number>;
  convertToBs: (usd: number) => number;
  formatBs: (usd: number) => string;
}

const DEFAULT_RATE = 50.0;
const BCV_API = "https://script.google.com/macros/s/AKfycbx0N47Hg6XebPBhgSLnfkaFyR4ez9_UWFTCS0mcb978i5r-iraxcM5svMJao2HMtrtiAA/exec?token=Lvbp1994";

export const useBCV = create<BCVState>((set, get) => {
  // Load cached rate on store creation (client side only)
  let cachedRate = DEFAULT_RATE;
  let cachedUpdate = '';
  if (typeof window !== 'undefined') {
    const savedRate = localStorage.getItem('bcv_rate');
    const savedUpdate = localStorage.getItem('bcv_last_update');
    if (savedRate) cachedRate = parseFloat(savedRate);
    if (savedUpdate) cachedUpdate = savedUpdate || '';
  }

  return {
    rate: cachedRate,
    lastUpdate: cachedUpdate,
    loading: false,
    error: null,
    initialized: false,

    fetchRate: async () => {
      if (get().loading && get().initialized) return get().rate;
      set({ loading: true, error: null });
      try {
        const res = await fetch(BCV_API);
        if (!res.ok) throw new Error('Failed to fetch BCV rate');
        const data = await res.json();
        if (data && data.ok && data.bcv && typeof data.bcv.price === 'number') {
          const rateVal = data.bcv.price;
          const updateVal = data.bcv.last_update || '';
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('bcv_rate', rateVal.toString());
            localStorage.setItem('bcv_last_update', updateVal);
          }
          
          set({ rate: rateVal, lastUpdate: updateVal, loading: false, initialized: true });
          return rateVal;
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error fetching rate';
        console.error('Error fetching BCV rate, using cached value:', err);
        set({ loading: false, error: message, initialized: true });
        return get().rate;
      }
    },

    convertToBs: (usd: number) => {
      return usd * get().rate;
    },

    formatBs: (usd: number) => {
      const bsAmount = usd * get().rate;
      return new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'VES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(bsAmount);
    }
  };
});
