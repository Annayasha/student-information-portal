import StudentCard from "./StudentCard";

function StudentList({ students }) {

  return (
    <div className="student-grid">

      {students.map((student) => (
        <StudentCard
          key={student.rollNumber}
          name={student.name}
          rollNumber={student.rollNumber}
          department={student.department}
          semester={student.semester}
          cgpa={student.cgpa}
          photo={student.photo}
        />
      ))}

    </div>
  );
}

export default StudentList;