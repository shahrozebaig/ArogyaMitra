import { useState, useEffect, useRef } from "react";
import { User as UserIcon, Trash2, Camera } from "lucide-react";
import useUserStore from "../store/userStore";
import useToastStore from "../store/toastStore";
import API from "../api/axios";
import "./Profile.css";
function Profile() {
  const addToast = useToastStore((state) => state.addToast);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: ""
  });
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('arogya_profile_image') || null;
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/health/profile");
        if (res.data) {
          setFormData({
            name: user?.name || "",
            email: user?.email || "",
            age: String(res.data.age) || "",
            height: String(res.data.height) || "",
            weight: String(res.data.weight) || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [user]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        localStorage.setItem('arogya_profile_image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      await API.post("/health/profile/update", {
        age: parseInt(formData.age) || 0,
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
        fitness_goal: user?.fitness_goal || "Stay Fit",
        fitness_level: user?.fitness_level || "Beginner",
        workout_location: user?.workout_location || "Home",
        workout_time: user?.workout_time || "Morning"
      });
      addToast("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      addToast("Update failed. Please check your data.", "error");
    }
  };
  const confirmResetAccount = async () => {
    try {
      await API.post("/health/reset");
      addToast("Account reset successfully.");
      window.location.href = "/health";
    } catch (err) {
      console.error("Reset failed:", err);
    }
  };
  const confirmDeleteAccount = async () => {
    try {
      if (!user?.id) {
        addToast("Error: User ID not found.", "error");
        return;
      }
      await API.delete(`/auth/delete?user_id=${user.id}`);
      addToast("Your account has been deleted.");
      logout();
      window.location.href = "/";
    } catch (err) {
      console.error("Deletion failed:", err);
      addToast("Could not delete account. Please try again later.", "error");
    }
  };
  return (
    <div className="pr-root">
      {showResetModal && (
        <div className="pr-modal-overlay">
          <div className="pr-modal">
            <h3 className="pr-modal-title">Reset Account</h3>
            <p className="pr-modal-desc">Are you sure you want to reset your account? All progress will be cleared.</p>
            <div className="pr-modal-actions">
              <button onClick={() => setShowResetModal(false)} className="pr-modal-cancel">Cancel</button>
              <button onClick={confirmResetAccount} className="pr-modal-confirm pr-modal-reset">Yes, Reset</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="pr-modal-overlay">
          <div className="pr-modal">
            <h3 className="pr-modal-title pr-modal-title-danger">Delete Account</h3>
            <p className="pr-modal-desc">CRITICAL: Are you sure you want to PERMANENTLY DELETE your account? This action cannot be undone and all your data will be erased forever.</p>
            <div className="pr-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="pr-modal-cancel">Cancel</button>
              <button onClick={confirmDeleteAccount} className="pr-modal-confirm pr-modal-delete">Permanently Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="pr-header">
        <div className="pr-header-left">
          <h1 className="pr-title"><UserIcon className="pr-icon" size={32} /> My <span className="pr-title-green">Account</span></h1>
          <p className="pr-subtitle">Manage your personal settings and health profile.</p>
        </div>
        <button onClick={() => setShowDeleteModal(true)} className="pr-delete-btn">
          <Trash2 size={18} /> Delete Account
        </button>
      </div>
      <div className="pr-grid">
        <div className="pr-card-profile">
          <div className="pr-avatar-wrap" onClick={() => fileInputRef.current.click()}>
            <div className="pr-avatar">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="pr-avatar-img" />
              ) : (
                formData.name.charAt(0) || "U"
              )}
              <div className="pr-avatar-overlay">
                <Camera size={20} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="pr-info-wrap">
            <h2 className="pr-name">{formData.name || "User Name"}</h2>
            <p className="pr-email">{formData.email}</p>
          </div>
        </div>
        <div className="pr-card-form">
          <h3 className="pr-form-section-title">Identity Details</h3>
          <div className="pr-inputs-grid">
            <div className="pr-input-group">
              <label className="pr-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pr-input"
                placeholder="Your Name"
              />
            </div>
            <div className="pr-input-group">
              <label className="pr-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="pr-input"
                disabled
                title="Email cannot be changed"
              />
            </div>
            <div className="pr-input-group">
              <label className="pr-label">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="pr-input"
                placeholder="e.g. 25"
              />
            </div>
            <div className="pr-input-group">
              <label className="pr-label">Height (CM)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="pr-input"
                placeholder="e.g. 175"
              />
            </div>
            <div className="pr-input-group">
              <label className="pr-label">Weight (KG)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="pr-input"
                placeholder="e.g. 70"
              />
            </div>
          </div>
          <div className="pr-actions">
            <button onClick={handleUpdateProfile} className="pr-save-btn">
              Save Changes ➔
            </button>
            <button onClick={() => setShowResetModal(true)} className="pr-reset-btn">
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;