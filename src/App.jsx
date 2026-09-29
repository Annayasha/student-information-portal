import { useState } from "react";

import Header from "./components/Header";
import StudentList from "./components/StudentList";
import Footer from "./components/Footer";

function App() {

  const students = [
    {
      name: "Rahul Das",
      rollNumber: "CSE001",
      department: "Computer Science",
      semester: "6th",
      cgpa: 9.2,
      photo: "https://tse2.mm.bing.net/th/id/OIP.YMFEH2TywxKdI6B7ghN72AHaHa?r=0&w=2000&h=2000&rs=1&pid=ImgDetMain&o=7&rm=3"
    },

    {
      name: "Priya Sen",
      rollNumber: "BCA002",
      department: "BCA",
      semester: "4th",
      cgpa: 8.8,
      photo: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI1LTA2L3Jhd3BpeGVsb2ZmaWNlN19waG90b19vZl95b3VuZ19pbmRpYW5fZ2lybF9ob2xkaW5nX3N0dWRlbnRfYmFja183YTA4NjRmMS03Mzk2LTQ3MTktOTQ2Zi05ZTI2ZWE2ZDJjYmFfMS5qcGc.jpg"
    },

    {
      name: "Arjun Roy",
      rollNumber: "IT003",
      department: "Information Technology",
      semester: "6th",
      cgpa: 8.5,
      photo: "https://img.freepik.com/premium-photo/indian-student-white-background_582637-21891.jpg?w=2000"
    },

    {
      name: "Sneha Paul",
      rollNumber: "BCA004",
      department: "BCA",
      semester: "4th",
      cgpa: 9.5,
      photo: "https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAzL2ZyZWVpbWFnZXNjb21wYW55X3Bob3RvX29mX3lvdW5nX2luZGlhbl9naXJsX2hvbGRpbmdfc3R1ZGVudF9iYV8zN2QyNjU4Yi0yOWIwLTQyZmQtODhmYy04OGU3ZTcxYmVlNDdfMS5qcGc.jpg"
    },

    {
      name: "Aditya Ghosh",
      rollNumber: "CSE005",
      department: "Computer Science",
      semester: "6th",
      cgpa: 7.9,
      photo: "https://img.freepik.com/premium-photo/young-male-indian-student-isolated-white-background_582637-21680.jpg?w=2000"
    },

    {
      name: "Riya Mukherjee",
      rollNumber: "IT006",
      department: "Information Technology",
      semester: "4th",
      cgpa: 8.1,
      photo: "https://i.pravatar.cc/300?img=32"
    }
  ];

  const [sortOrder, setSortOrder] = useState("high");

  const sortedStudents = [...students].sort((a, b) => {

    if (sortOrder === "high") {
      return b.cgpa - a.cgpa;
    }

    return a.cgpa - b.cgpa;
  });

  return (
    <div className="app">

      <Header />

      <main>

        <section className="hero-section">

          <div className="hero-content">

            <div className="hero-text">

              <span className="hero-tag">
                STUDENT DATABASE
              </span>

              <h1>
                Student Information
                <span> Portal</span>
              </h1>

              <p>
                Explore academic information, achievements and
                performance details of our students.
              </p>

            </div>

            <div className="hero-stat">

              <strong>
                {students.length}
              </strong>

              <span>
                Total Students
              </span>

            </div>

          </div>

        </section>

        <section className="students-section">

          <div className="section-heading">

            <div>
              <span>
                ACADEMIC DIRECTORY
              </span>

              <h2>
                Student Records
              </h2>
            </div>

            <div className="sort-container">

              <label htmlFor="sort">
                Sort by CGPA
              </label>

              <select
                id="sort"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value)
                }
              >

                <option value="high">
                  High → Low
                </option>

                <option value="low">
                  Low → High
                </option>

              </select>

            </div>

          </div>

          <StudentList students={sortedStudents} />

        </section>

      </main>

      <Footer />

    </div>
  );
}

export default App;