import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AddStudent from "./pages/AddStudent";
import Dashboard from "./pages/Dashboard";
import EditStudent from "./pages/EditStudent";
import Login from "./pages/Login";
import StudentList from "./pages/StudentList";

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<StudentList />} />
      <Route path="/students/add" element={<AddStudent />} />
      <Route path="/students/:id/edit" element={<EditStudent />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
