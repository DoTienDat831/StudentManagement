import { useEffect, useState } from "react";
import studentApi from "../api/studentApi";
import majorApi from "../api/majorApi";

const empty = {
    name: "",
    dateOfBirth: "",
    enrollmentTime: "",
    email:"",
    majorId: ""
};

function useStudents() {
    const [students, setStudents] = useState([]);
    const [addForm, setAddForm] = useState(empty);
    const [editForm, setEditForm] = useState(empty);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [addError, setAddError] = useState("");
    const [editError, setEditError] = useState("");
    const [majors, setMajors] = useState([]);

    // Lấy danh sách student từ backend
    const load = async () => {
        try {
            const { data } = await studentApi.getAll();
            setStudents(data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Không thể tải danh sách sinh viên"
            );
        }
    };

    const loadMajors = async () => {
        try {
            const { data } = await majorApi.getAll();
            setMajors(data);
        } catch (err) {
            console.error("Không thể tải danh sách major:", err);
        }
    };

    // Chỉ load dữ liệu khi component được tạo
    useEffect(() => {
        load();
        loadMajors();
    }, []);

    const updateForm = (form, setForm, e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const makeStudentPayload = (form) => ({
        name: form.name,
        dateOfBirth: form.dateOfBirth || null,
        enrollmentTime: form.enrollmentTime || null,
        email: form.email,
        major: { id: Number(form.majorId) }
    });

    // Luồng tạo mới độc lập với luồng cập nhật.
    const handleAddChange = (e) => updateForm(addForm, setAddForm, e);
    const handleEditChange = (e) => updateForm(editForm, setEditForm, e);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setAddError("");

        try {
            await studentApi.create(makeStudentPayload(addForm));
            setAddForm(empty);
            await load();
        } catch (err) {
            setAddError(
                err.response?.data?.message ||
                "Không thể thêm sinh viên"
            );
        }
    };

    // Mở form cập nhật riêng; không thay đổi form thêm mới.
    const handleEdit = (student) => {
        setEditForm({
            name: student.name || "",
            dateOfBirth: student.dateOfBirth || "",
            enrollmentTime: student.enrollmentTime || "",
            email: student.email || "",
            majorId: student.major?.id ? String(student.major.id) : ""
        });

        setEditingId(student.id);
        setEditError("");
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (editingId == null) return;
        setEditError("");

        try {
            await studentApi.update(editingId, makeStudentPayload(editForm));
            setEditingId(null);
            setEditForm(empty);
            await load();
        } catch (err) {
            setEditError(
                err.response?.data?.message ||
                "Không thể cập nhật sinh viên"
            );
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm(empty);
        setEditError("");
    };

    // Xóa student
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this student?")) {
            return;
        }

        try {
            await studentApi.delete(id);
            await load();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Không thể xóa sinh viên"
            );
        }
    };

    // Tìm theo ID số hoặc mã sinh viên.
    const query = search.trim().toLowerCase();
    const filteredStudents = students.filter((student) =>
        String(student.id).toLowerCase().includes(query) ||
        student.studentCode?.toLowerCase().includes(query)
    );

    return {
        students: filteredStudents,
        majors,
        addForm,
        editForm,
        editingId,
        search,
        error,
        addError,
        editError,
        setSearch,
        handleAddChange,
        handleEditChange,
        handleAddSubmit,
        handleUpdateSubmit,
        handleEdit,
        handleCancelEdit,
        handleDelete
    };
}

export default useStudents;
