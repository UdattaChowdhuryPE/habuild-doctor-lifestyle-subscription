import { MOCK_DOCTOR } from "@/lib/mockData";

export const useAuthProfile = () => {
  const MOCK_USER = {
    id: MOCK_DOCTOR.id,
    phone: "+91" + MOCK_DOCTOR.phone,
  };

  return {
    profile: MOCK_DOCTOR,
    isLoading: false,
    error: null,
    user: MOCK_USER,
  };
};
