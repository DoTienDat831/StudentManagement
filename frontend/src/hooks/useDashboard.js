import { useEffect, useMemo, useState } from "react";
import departmentApi from "../api/departmentApi";
import classApi from "../api/classApi";
import studentApi from "../api/studentApi";

function useDashboard() {
    const [classes, setClasses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            setLoading(true);
            setError("");

            const [classResult, departmentResult, studentResult] = await Promise.allSettled([
                classApi.getAll(),
                departmentApi.getAll(),
                studentApi.getAll()
            ]);

            if (!active) return;

            if (classResult.status === "fulfilled") setClasses(classResult.value.data || []);
            if (departmentResult.status === "fulfilled") setDepartments(departmentResult.value.data || []);
            if (studentResult.status === "fulfilled") setStudents(studentResult.value.data || []);

            const failed = [classResult, departmentResult, studentResult].some(
                (result) => result.status === "rejected"
            );
            if (failed) setError("Some dashboard data could not be loaded. Counts may be incomplete.");
            setLoading(false);
        };

        loadDashboard();
        return () => { active = false; };
    }, []);

    const classStats = useMemo(() => {
        const counts = new Map();
        students.forEach((student) => {
            const classId = student.studentClass?.id;
            if (classId != null) counts.set(String(classId), (counts.get(String(classId)) || 0) + 1);
        });

        return classes.map((studentClass) => {
            const departmentId = studentClass.department?.id ?? studentClass.departmentId;
            const department = studentClass.department || departments.find(
                (item) => String(item.id) === String(departmentId)
            );

            return {
                ...studentClass,
                departmentName: department?.departmentName || department?.name || "Unassigned",
                studentCount: counts.get(String(studentClass.id)) || 0
            };
        });
    }, [classes, departments, students]);

    return { classStats, totalStudents: students.length, loading, error };
}

export default useDashboard;
