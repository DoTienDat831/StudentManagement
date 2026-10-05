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
    const [form, setForm] = useState(empty);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
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

    // Xử lý thay đổi input
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Thêm / cập nhật student
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const student = {
                name: form.name,
                dateOfBirth: form.dateOfBirth,
                enrollmentTime: form.enrollmentTime,
                email: form.email,
                major: {
                    id: Number(form.majorId)
                }
            };

            console.log("DATA SEND TO BACKEND:", student);

            if (editingId) {
                await studentApi.update(editingId, student);
            } else {
                await studentApi.create(student);
            }

            setForm(empty);
            setEditingId(null);
            await load();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    // Chọn student để chỉnh sửa
    const handleEdit = (student) => {
        setForm({
            name: student.name || "",
            dateOfBirth: student.dateOfBirth || "",
            enrollmentTime: student.enrollmentTime || "",
            major: student.major || ""
        });

        setEditingId(student.id);
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

    // Tìm kiếm theo ID
    const filteredStudents = students.filter((student) =>
        student.studentCode?.toLowerCase().includes(search.toLowerCase())
    );

    return {
        students: filteredStudents,
        majors,
        form,
        editingId,
        search,
        error,
        setSearch,
        handleChange,
        handleSubmit,
        handleEdit,
        handleDelete
    };
}

export default useStudents;