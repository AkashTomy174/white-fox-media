import { UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";
import { useStudents } from "../hooks/useStudents";

const gradeOptions = Array.from({ length: 12 }, (_, index) => `Grade ${index + 1}`);

const StudentList = () => {
  const { students, pagination, loading, fetchStudents, deleteStudent, updateStudentStatus } = useStudents();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [grade, setGrade] = useState("");
  const [page, setPage] = useState(1);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchStudents({ page, search: debouncedSearch, status, grade });
  }, [fetchStudents, page, debouncedSearch, status, grade]);

  const modalMessage = useMemo(() => {
    if (!studentToDelete) return "";
    return `Delete ${studentToDelete.first_name} ${studentToDelete.last_name}? This action cannot be undone.`;
  }, [studentToDelete]);

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    setDeleting(true);
    try {
      await deleteStudent(studentToDelete.id);
      toast.success("Student deleted successfully.");
      setStudentToDelete(null);
      fetchStudents({ page, search: debouncedSearch, status, grade });
    } catch {
      toast.error("Unable to delete student.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleStudentStatus = async (student) => {
    const nextStatus = student.status === "active" ? "inactive" : "active";
    setStatusUpdatingId(student.id);
    try {
      await updateStudentStatus(student.id, nextStatus);
      toast.success(`Student ${nextStatus === "active" ? "activated" : "deactivated"} successfully.`);
      fetchStudents({ page, search: debouncedSearch, status, grade });
    } catch {
      toast.error("Unable to update student status.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="section-label">Students / All Records</p>
          <h1 className="page-title mt-2">Students</h1>
        </div>
        <Link className="btn-primary w-full sm:w-auto" to="/students/add">
          <UserPlus size={18} aria-hidden="true" />
          Add Student
        </Link>
      </div>

      <div className="grid gap-3 border border-ink-border bg-ink-surface p-4 lg:grid-cols-[minmax(220px,1fr)_176px_176px]">
        <SearchBar onChange={setSearch} value={search} />
        <select className="input" onChange={(event) => { setGrade(event.target.value); setPage(1); }} value={grade}>
          <option value="">All grades</option>
          {gradeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select className="input" onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="border border-ink-border">
        <StudentTable
          loading={loading}
          onDelete={setStudentToDelete}
          onToggleStatus={toggleStudentStatus}
          statusUpdatingId={statusUpdatingId}
          students={students}
        />
        <Pagination count={pagination.count} onPageChange={setPage} page={page} />
      </div>

      <ConfirmModal
        loading={deleting}
        message={modalMessage}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={confirmDelete}
        open={Boolean(studentToDelete)}
        title="Delete student"
      />
    </div>
  );
};

export default StudentList;
