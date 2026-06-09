import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import StudentForm from "../components/StudentForm";
import { useStudents } from "../hooks/useStudents";

const AddStudent = () => {
  const { createStudent } = useStudents();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await createStudent(values);
    toast.success("Student created successfully.");
    navigate("/students");
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="section-label">Student Information</p>
        <h1 className="page-title mt-2">Add Student</h1>
      </div>
      <StudentForm onSubmit={handleSubmit} submitLabel="Create Student" />
    </div>
  );
};

export default AddStudent;
