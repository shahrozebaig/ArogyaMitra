import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HealthAssessment from "./pages/HealthAssessment";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import WorkoutSession from "./pages/WorkoutSession";
import WorkoutComplete from "./pages/WorkoutComplete";
import AICoach from "./pages/AICoach";
import Profile from "./pages/Profile";
import MainLayout from "./layout/MainLayout";
import ToastContainer from "./components/ToastContainer";
import { useEffect } from "react";
import useUserStore from "./store/userStore";
import API from "./api/axios";
function App() {
  const { token, logout, setUser } = useUserStore();
  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await API.get("/auth/me");
          if (res.data?.user) {
            setUser(res.data.user, token);
          }
        } catch (err) {
          console.error("Session verification failed:", err);
          logout();
        }
      }
    };
    verifySession();
  }, [token, logout, setUser]);
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/health" element={<MainLayout><HealthAssessment /></MainLayout>} />
        <Route path="/workouts" element={<MainLayout><Workouts /></MainLayout>} />
        <Route path="/nutrition" element={<MainLayout><Nutrition /></MainLayout>} />
        <Route path="/progress" element={<MainLayout><Progress /></MainLayout>} />
        <Route path="/session" element={<WorkoutSession />} />
        <Route path="/workout-complete" element={<MainLayout><WorkoutComplete /></MainLayout>} />
        <Route path="/ai-coach" element={<MainLayout><AICoach /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
      </Routes>
    </Router>
  );
}
export default App;