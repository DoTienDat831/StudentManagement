import { BookOpen, GraduationCap, Users } from "lucide-react";
import useDashboard from "../hooks/useDashboard";
import "./Dashboard.css";

function Dashboard() {
    const { classStats, totalStudents, loading, error } = useDashboard();

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <p className="dashboard-eyebrow">OVERVIEW</p>
                <h1>Dashboard</h1>
                <p className="dashboard-subtitle">Student enrollment by class and department</p>
            </header>

            <section className="dashboard-summary" aria-label="Student overview">
                <div className="dashboard-summary-card">
                    <span className="dashboard-summary-icon"><Users size={20} /></span>
                    <div><span>Total students</span><strong>{loading ? "—" : totalStudents}</strong></div>
                </div>
                <div className="dashboard-summary-card">
                    <span className="dashboard-summary-icon dashboard-summary-icon--blue"><BookOpen size={20} /></span>
                    <div><span>Classes</span><strong>{loading ? "—" : classStats.length}</strong></div>
                </div>
            </section>

            <section className="dashboard-class-section" aria-labelledby="dashboard-classes-heading">
                <div className="dashboard-section-heading">
                    <div>
                        <h2 id="dashboard-classes-heading">Students by class</h2>
                        <p>Each class and its department</p>
                    </div>
                    <span className="dashboard-class-total"><GraduationCap size={16} /> {classStats.length} classes</span>
                </div>
                {error && <p className="dashboard-error" role="status">{error}</p>}
                <div className="dashboard-class-grid">
                    {loading ? (
                        <p className="dashboard-empty">Loading dashboard…</p>
                    ) : classStats.length === 0 ? (
                        <p className="dashboard-empty">No classes available.</p>
                    ) : classStats.map((classEntry) => (
                        <article className="dashboard-class-card" key={classEntry.id}>
                            <div className="dashboard-class-card-top">
                                <span className="dashboard-class-icon"><BookOpen size={18} /></span>
                                <span className="dashboard-student-count">{classEntry.studentCount} {classEntry.studentCount === 1 ? "student" : "students"}</span>
                            </div>
                            <h3>{classEntry.name}</h3>
                            <p className="dashboard-department-label">Department</p>
                            <p className="dashboard-department-name">{classEntry.departmentName}</p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
