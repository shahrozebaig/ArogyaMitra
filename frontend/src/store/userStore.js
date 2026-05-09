import { create } from "zustand";
const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  profileImage: localStorage.getItem("arogya_profile_image") || null,
  preferredVoice: localStorage.getItem("arogya_preferred_voice") || null,
  setUser: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    if (user.profile_image) {
      localStorage.setItem("arogya_profile_image", user.profile_image);
      set({ user, token, profileImage: user.profile_image });
    } else {
      set({ user, token });
    }
  },
  setProfileImage: (img) => {
    localStorage.setItem("arogya_profile_image", img);
    set({ profileImage: img });
  },
  setPreferredVoice: (voice) => {
    localStorage.setItem("arogya_preferred_voice", voice);
    set({ preferredVoice: voice });
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("arogya_profile_image");
    localStorage.removeItem("arogya_preferred_voice");
    set({ user: null, token: null, profileImage: null, preferredVoice: null });
  },
}));
export default useUserStore;