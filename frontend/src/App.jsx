import Student from "./components/Student";
import useStudents from "./hooks/useStudents";
import Sidebar from "./components/Sidebar";
import Department from "./components/Department";
import useDepartments from "./hooks/useDepartments";
import { useState } from "react";
import "./App.css";

function App() {
    const studentData = useStudents();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activePage, setActivePage] = useState("students");

    return (
        <div className={`app-shell${sidebarCollapsed ? " is-collapsed" : ""}`}>
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
                activePage={activePage}
                onNavigate={setActivePage}
            />
            <main className="app-main">
                {activePage === "departments" ? (
                    <Department />
                ) : (
                    <Student className="student-management" {...studentData} />
                )}
            </main>
        </div>
    );
}

export default App;
