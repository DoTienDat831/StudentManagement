import Student from "./components/Student";
import useStudents from "./hooks/useStudents";
import "./App.css";

function App() {
    const studentData = useStudents();

    return (
        

        <Student className="student-management" {...studentData} />
    );
}

export default App;