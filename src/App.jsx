import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Servers from "./pages/Servers";
import Deployments from "./pages/Deployments";
import Scripts from "./pages/Scripts";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/servers" element={<PrivateRoute><Servers /></PrivateRoute>} />
        <Route path="/deployments" element={<PrivateRoute><Deployments /></PrivateRoute>} />
        <Route path="/scripts" element={<PrivateRoute><Scripts /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}