import StudentUI from "./components/Student";
import "./App.css";

import studentApi from "./api/studentApi";
import { useEffect, useState } from "react";

const empty = {
    name: "",
    dateOfBirth: "",
    enrollmentTime: "",
    majorId: ""
};

function App() {
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState(empty);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

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

    // Chỉ load dữ liệu khi component được tạo
    useEffect(() => {
        load();
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
                major: {
                    id: Number(form.majorId)
                }
            };

            if (editingId) {
                await studentApi.update(editingId, form);
            } else {
                await studentApi.create(form);
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

    return (
        <div className="app">
            <div className="app-container">
                <StudentUI
                    students={filteredStudents}
                    form={form}
                    editingId={editingId}
                    search={search}
                    error={error}
                    setSearch={setSearch}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
}

export default App;
