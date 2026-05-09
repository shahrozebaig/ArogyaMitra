import { create } from "zustand";
const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  profileImage: localStorage.getItem("arogya_profile_image") || null,
  preferredVoice: localStorage.getItem("arogya_preferred_voice") || null,
  setUser: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    const profileImage = user.profile_image || null;
    if (profileImage) {
      localStorage.setItem("arogya_profile_image", profileImage);
    } else {
      localStorage.removeItem("arogya_profile_image");
    }
    set({ user, token, profileImage });
  },
  setProfileImage: (img) => {
    localStorage.setItem("arogya_profile_image", img);
    set((state) => ({
      profileImage: img,
      user: state.user ? { ...state.user, profile_image: img } : null
    }));
    // Also update the user object in localStorage if it exists
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      storedUser.profile_image = img;
      localStorage.setItem("user", JSON.stringify(storedUser));
    }
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