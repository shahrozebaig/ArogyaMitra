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
function App() {
  return (
    <Router>
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