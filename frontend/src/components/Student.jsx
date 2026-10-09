import { Bell, Mail, X, Pencil, Trash2, Search } from "lucide-react";

function StudentFields({ form, majors, onChange }) {
    return (
        <>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={onChange}
                required
            />
            <input
                type="date"
                name="dateOfBirth"
                aria-label="Date of birth"
                value={form.dateOfBirth || ""}
                onChange={onChange}
            />
            <input
                type="date"
                name="enrollmentTime"
                aria-label="Enrollment date"
                value={form.enrollmentTime || ""}
                onChange={onChange}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email || ""}
                onChange={onChange}
            />
            <select
                name="majorId"
                value={form.majorId}
                onChange={onChange}
                required
            >
                <option value="">-- Select Major --</option>
                {majors.map((major) => (
                    <option key={major.id} value={major.id}>
                        {major.name}
                    </option>
                ))}
            </select>
        </>
    );
}

export default function Student({
    students,
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
}) {
    const editingStudent = students.find((student) => student.id === editingId);

    return (
        <>
            <div className="stu-top-page">
                <Bell />
                <Mail />
            </div>

            <div className="student-container">
                <h1>Student Management</h1>
            </div>

            <section className="student-form-section" aria-labelledby="add-student-heading">
                <h2 id="add-student-heading">Add student</h2>
                <form onSubmit={handleAddSubmit} className="student-form add-student-form">
                    <StudentFields form={addForm} majors={majors} onChange={handleAddChange} />
                    <button type="submit" className="add-btn">Add student</button>
                </form>
                {addError && <p className="form-error" role="alert">{addError}</p>}
            </section>

            {editingId != null && (
                <section className="student-form-section edit-student-section" aria-labelledby="edit-student-heading">
                    <div className="edit-student-heading-row">
                        <div>
                            <h2 id="edit-student-heading">Update student</h2>
                            <p>{editingStudent?.studentCode || `Student #${editingId}`}</p>
                        </div>
                        <button
                            type="button"
                            className="cancel-edit-icon"
                            aria-label="Close update form"
                            onClick={handleCancelEdit}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <form onSubmit={handleUpdateSubmit} className="student-form edit-student-form">
                        <StudentFields form={editForm} majors={majors} onChange={handleEditChange} />
                        <div className="edit-form-actions">
                            <button type="submit" className="update-btn">Save changes</button>
                            <button type="button" className="cancel-edit-btn" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    </form>
                    {editError && <p className="form-error" role="alert">{editError}</p>}
                </section>
            )}

            {error && <p className="form-error" role="alert">{error}</p>}

            <section className="student-list-card">
                <div className="student-list-heading">
                    <div>
                        <h2>Student list</h2>
                        <p>{students.length} student{students.length === 1 ? "" : "s"}</p>
                    </div>
                    <label className="student-search">
                        <Search size={16} />
                        <input
                            type="search"
                            placeholder="Search students"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search by ID or student code"
                        />
                    </label>
                </div>
                <div className="student-table-wrap">
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Birth</th>
                                <th>Enrollment</th>
                                <th>Email</th>
                                <th>Major</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr><td colSpan="7" className="student-empty">No students found.</td></tr>
                            ) : students.map((student) => (
                                <tr key={student.id}>
                                    <td><span className="student-code">{student.studentCode}</span></td>
                                    <td className="student-name-cell">{student.name}</td>
                                    <td>{student.dateOfBirth || "—"}</td>
                                    <td>{student.enrollmentTime || "—"}</td>
                                    <td>{student.email || "—"}</td>
                                    <td>{student.major?.name || "—"}</td>
                                    <td>
                                        <div className="student-row-actions">
                                            <button type="button" onClick={() => handleEdit(student)} aria-label={`Edit ${student.name}`} title="Edit"><Pencil size={15} /></button>
                                            <button type="button" onClick={() => handleDelete(student.id)} aria-label={`Delete ${student.name}`} title="Delete"><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
