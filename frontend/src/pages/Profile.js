import { useState, useEffect, useRef } from "react";
import { User as UserIcon, Trash2, Camera } from "lucide-react";
import useUserStore from "../store/userStore";
import useToastStore from "../store/toastStore";
import API from "../api/axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import "./Profile.css";
function Profile() {
  const addToast = useToastStore((state) => state.addToast);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const profileImage = useUserStore((state) => state.profileImage);
  const setProfileImage = useUserStore((state) => state.setProfileImage);
  const preferredVoice = useUserStore((state) => state.preferredVoice);
  const setPreferredVoice = useUserStore((state) => state.setPreferredVoice);
  const fileInputRef = useRef(null);
  const [voices, setVoices] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: "",
    height: "",
    weight: ""
  });

  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
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
      reader.onload = () => {
        setImageToCrop(reader.result);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = null;
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setProfileImage(croppedImage);
      if (fileInputRef.current) fileInputRef.current.value = null;
      setShowCropModal(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
      addToast("Failed to crop image", "error");
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
            <div className="pr-input-group">
              <label className="pr-label">AI Coach Voice (Male/Female)</label>
              <select 
                className="pr-input pr-select" 
                value={preferredVoice || ""} 
                onChange={(e) => setPreferredVoice(e.target.value)}
              >
                <option value="">Default System Voice</option>
                {voices
                  .filter(v => {
                    const l = v.lang.toLowerCase();
                    return l.startsWith('en') || l.startsWith('hi') || l.startsWith('te');
                  })
                  .map((v) => {
                    let langLabel = "English";
                    if (v.lang.startsWith('hi')) langLabel = "Hindi";
                    if (v.lang.startsWith('te')) langLabel = "Telugu";
                    
                    const name = v.name.toLowerCase();
                    let gender = "";
                    if (name.includes("female") || name.includes("zira") || name.includes("hazel") || name.includes("susan") || name.includes("heera")) gender = "Woman";
                    else if (name.includes("male") || name.includes("david") || name.includes("mark") || name.includes("ravi") || name.includes("hemant")) gender = "Man";
                    
                    const finalLabel = gender ? `${langLabel} (${gender}) - ${v.name}` : `${langLabel} - ${v.name}`;

                    return (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {finalLabel}
                      </option>
                    );
                  })
                }              </select>
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
      {showCropModal && (
        <div className="pr-modal-overlay">
          <div className="pr-modal pr-crop-modal">
            <h3 className="pr-modal-title">Adjust Profile Picture</h3>
            <div className="pr-crop-container">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="pr-crop-controls">
              <div className="pr-zoom-slider-wrap">
                <label className="pr-label">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="pr-zoom-slider"
                />
              </div>
              <div className="pr-modal-actions">
                <button className="pr-modal-cancel" onClick={() => setShowCropModal(false)}>Cancel</button>
                <button className="pr-modal-confirm" onClick={handleSaveCrop}>Save Image</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Profile;