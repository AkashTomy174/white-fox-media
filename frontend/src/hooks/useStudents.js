import { useCallback, useState } from "react";

import api from "../api/axios";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, results: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = useCallback(async ({ page = 1, search = "", status = "", grade = "" } = {}) => {
    setLoading(true);
    setError("");
    try {
      const params = { page };
      if (search) params.search = search;
      if (status) params.status = status;
      if (grade) params.grade = grade;
      const response = await api.get("/students", { params });
      const payload = response.data.data;
      setStudents(payload.results || payload);
      setPagination(payload.results ? payload : { count: payload.length, next: null, previous: null, results: payload });
      return payload;
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load students.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudent = useCallback(async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data.data;
  }, []);

  const createStudent = useCallback(async (data) => {
    const response = await api.post("/students", data);
    return response.data;
  }, []);

  const updateStudent = useCallback(async (id, data) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  }, []);

  const updateStudentStatus = useCallback(async (id, status) => {
    const response = await api.patch(`/students/${id}`, { status });
    return response.data;
  }, []);

  const deleteStudent = useCallback(async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  }, []);

  return {
    students,
    pagination,
    loading,
    error,
    fetchStudents,
    getStudent,
    createStudent,
    updateStudent,
    updateStudentStatus,
    deleteStudent,
  };
};
