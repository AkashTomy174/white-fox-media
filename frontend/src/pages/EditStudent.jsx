import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import StudentForm from "../components/StudentForm";
import { useStudents } from "../hooks/useStudents";

const EditStudent = () => {
  const { id } = useParams();
  const { getStudent, updateStudent } = useStudents();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setStudent(await getStudent(id));
      } catch {
        toast.error("Unable to load student.");
        navigate("/students");
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [getStudent, id, navigate]);

  const handleSubmit = async (values) => {
    await updateStudent(id, values);
    toast.success("Student updated successfully.");
    navigate("/students");
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="section-label">Student Information</p>
        <h1 className="page-title mt-2">Edit Student</h1>
      </div>
      {loading ? (
        <div className="border border-ink-border bg-ink-surface p-5 text-sm text-ink-secondary">
          Loading...
        </div>
      ) : (
        student && <StudentForm initialValues={student} onSubmit={handleSubmit} submitLabel="Update Student" />
      )}
    </div>
  );
};

export default EditStudent;
