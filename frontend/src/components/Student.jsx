export default function Student({
    students,
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
}) {
    return (
        <>
            <div className="student-container">
                <h1>Student Management</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="student-form">

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth || ""}
                    onChange={handleChange}
                />

                <input
                    type="date"
                    name="enrollmentTime"
                    placeholder="Enrollment time"
                    value={form.enrollmentTime || ""}
                    onChange={handleChange}
                />

                <input
                    type="string"
                    name="email"
                    placeholder="Email"
                    value={form.email || ""}
                    onChange={handleChange}
                />

                <select
                    name="majorId"
                    value={form.majorId}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select Major --</option>

                        {majors.map((major) => (
                            <option
                                key={major.id}
                                value={major.id}
                            >
                                {major.name}
                            </option>
                        ))}
                </select>

                <button
                    type="submit"
                    className="add-btn"
                >
                    {editingId ? "Update student" : "Add student"}
                </button>

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}
            </form>

            {/* Search */}
            <input
                className="search-by-id"
                placeholder="Search by id"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Student table */}
            <table className="student-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Birth</th>
                        <th>Enrollment</th>
                        <th>Email</th>
                        <th>Major</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>

                            <td>{student.studentCode}</td>

                            <td>{student.name}</td>

                            <td>{student.dateOfBirth}</td>

                            <td>{student.enrollmentTime}</td>

                            <td>{student.email}</td>

                            <td>{student.major?.name || ""}</td>

                            <td>
                                <button
                                    onClick={() =>
                                        handleEdit(student)
                                    }
                                >
                                    Edit
                                </button>

                                {" "}

                                <button
                                    onClick={() =>
                                        handleDelete(student.id)
                                    }
                                >
                                    Delete
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}