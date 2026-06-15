import { MOCK_DOCTOR } from "@/lib/mockData";

const MOCK_USER = {
  id: MOCK_DOCTOR.id,
  phone: "+91" + MOCK_DOCTOR.phone,
};

export const useAuth = () => {
  return {
    user: MOCK_USER,
    isLoading: false,
    error: null,
    logout: async () => {
      // Mock logout - in real app would call Supabase
    },
  };
};
