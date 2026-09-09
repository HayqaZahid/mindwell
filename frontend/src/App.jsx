import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MoodTracker from "./pages/MoodTracker.jsx";
import Journal from "./pages/Journal.jsx";
import Habits from "./pages/Habits.jsx";
import Breathing from "./pages/Breathing.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import Community from "./pages/Community.jsx";
import Resources from "./pages/Resources.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mood" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="/breathing" element={<ProtectedRoute><Breathing /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
      </Routes>
      </ErrorBoundary>
    </div>
  );
}
