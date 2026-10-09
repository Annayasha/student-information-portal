
import { useEffect, useMemo, useRef, useState } from "react";

const INITIAL_STUDENTS = [
  {
    id: "STU001",
    name: "Rahul Das",
    rollNumber: "CSE001",
    email: "rahul@example.com",
    phone: "9876543210",
    department: "Computer Science",
    semester: "6th",
    cgpa: 9.2,
    status: "Active",
    photo: "https://i.pravatar.cc/300?img=12",
  },
  {
    id: "STU002",
    name: "Priya Sen",
    rollNumber: "BCA002",
    email: "priya@example.com",
    phone: "9876543211",
    department: "BCA",
    semester: "4th",
    cgpa: 8.8,
    status: "Active",
    photo: "https://i.pravatar.cc/300?img=47",
  },
  {
    id: "STU003",
    name: "Arjun Roy",
    rollNumber: "IT003",
    email: "arjun@example.com",
    phone: "9876543212",
    department: "Information Technology",
    semester: "6th",
    cgpa: 8.5,
    status: "Active",
    photo: "https://i.pravatar.cc/300?img=13",
  },
  {
    id: "STU004",
    name: "Sneha Paul",
    rollNumber: "BCA004",
    email: "sneha@example.com",
    phone: "9876543213",
    department: "BCA",
    semester: "4th",
    cgpa: 9.5,
    status: "Active",
    photo: "https://i.pravatar.cc/300?img=44",
  },
  {
    id: "STU005",
    name: "Aditya Ghosh",
    rollNumber: "CSE005",
    email: "aditya@example.com",
    phone: "9876543214",
    department: "Computer Science",
    semester: "6th",
    cgpa: 7.9,
    status: "Inactive",
    photo: "https://i.pravatar.cc/300?img=14",
  },
  {
    id: "STU006",
    name: "Riya Mukherjee",
    rollNumber: "IT006",
    email: "riya@example.com",
    phone: "9876543215",
    department: "Information Technology",
    semester: "4th",
    cgpa: 8.1,
    status: "Active",
    photo: "https://i.pravatar.cc/300?img=45",
  },
];

const STORAGE_KEY = "studenthub-pro-records-v1";
const THEME_KEY = "studenthub-pro-theme-v1";

const EMPTY_FORM = {
  name: "",
  rollNumber: "",
  email: "",
  phone: "",
  department: "Computer Science",
  semester: "1st",
  cgpa: "",
  status: "Active",
  photo: "",
};

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "BCA",
  "BBA",
  "Data Science",
  "Electronics",
];

const SEMESTERS = [
  "1st", "2nd", "3rd", "4th",
  "5th", "6th", "7th", "8th",
];

function readSavedStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return INITIAL_STUDENTS;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

function makeId() {
  return `STU${Date.now()}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

function Icon({ children, className = "" }) {
  return (
    <span
      className={`icon ${className}`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function StudentAvatar({ student, size = "normal" }) {
  const initials = student.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`avatar avatar-${size}`}>
      {student.photo && (
        <img
          src={student.photo}
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
      <span>{initials || "ST"}</span>
    </div>
  );
}

function MetricCard({ icon, label, value, note, color }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${color}`}>
        <Icon>{icon}</Icon>
      </div>

      <div className="metric-info">
        <p>{label}</p>
        <h3>{value}</h3>
        <span>{note}</span>
      </div>
    </article>
  );
}

function StudentForm({ initialData, onSave, onClose, students }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...initialData,
    cgpa: initialData ? String(initialData.cgpa) : "",
  }));

  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.rollNumber.trim()) {
      setError("Student name and roll number are required.");
      return;
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.phone.trim() && !/^[+\d\s()-]{7,20}$/.test(form.phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    const cgpa = Number(form.cgpa);

    if (
      form.cgpa === "" ||
      !Number.isFinite(cgpa) ||
      cgpa < 0 ||
      cgpa > 10
    ) {
      setError("CGPA must be between 0 and 10.");
      return;
    }

    if (
      form.photo.trim() &&
      !/^https?:\/\/\S+$/i.test(form.photo.trim())
    ) {
      setError("Photo must be a valid HTTP or HTTPS URL.");
      return;
    }

    const duplicate = students.some(
      (student) =>
        student.rollNumber.trim().toLowerCase() ===
          form.rollNumber.trim().toLowerCase() &&
        student.id !== initialData?.id
    );

    if (duplicate) {
      setError("This roll number already exists.");
      return;
    }

    onSave({
      ...form,
      id: initialData?.id || makeId(),
      name: form.name.trim(),
      rollNumber: form.rollNumber.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      photo: form.photo.trim(),
      cgpa,
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className="modal form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-form-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">
              STUDENT MANAGEMENT
            </span>
            <h2 id="student-form-title">
              {initialData ? "Edit student" : "Add new student"}
            </h2>
            <p>Enter the student's academic and contact information.</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field">
              Student name *
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Ananya Sharma"
                required
                maxLength={80}
                autoFocus
              />
            </label>

            <label className="field">
              Roll number *
              <input
                name="rollNumber"
                value={form.rollNumber}
                onChange={updateField}
                placeholder="e.g. CSE007"
                required
                maxLength={30}
              />
            </label>

            <label className="field">
              Email address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="student@example.com"
              />
            </label>

            <label className="field">
              Phone number
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="Enter phone number"
                maxLength={20}
              />
            </label>

            <label className="field">
              Department
              <select
                name="department"
                value={form.department}
                onChange={updateField}
              >
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              Semester
              <select
                name="semester"
                value={form.semester}
                onChange={updateField}
              >
                {SEMESTERS.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester} semester
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              CGPA (0–10) *
              <input
                name="cgpa"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.cgpa}
                onChange={updateField}
                placeholder="e.g. 8.5"
                required
              />
            </label>

            <label className="field">
              Student status
              <select
                name="status"
                value={form.status}
                onChange={updateField}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>

            <label className="field full-field">
              Profile photo URL (optional)
              <input
                name="photo"
                type="url"
                value={form.photo}
                onChange={updateField}
                placeholder="https://example.com/photo.jpg"
              />
            </label>
          </div>

          {error && (
            <p className="form-error" role="alert">
              <Icon>!</Icon> {error}
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              {initialData ? "Save changes" : "Add student"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function StudentDetails({ student, onClose, onEdit }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className="modal detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        <div className="detail-cover">
          <button
            className="icon-button detail-close"
            onClick={onClose}
            aria-label="Close profile"
          >
            ✕
          </button>

          <StudentAvatar student={student} size="large" />

          <h2 id="profile-title">{student.name}</h2>
          <p>{student.rollNumber}</p>

          <span className={`status ${student.status === "Active" ? "status-active" : "status-inactive"}`}>
            {student.status}
          </span>
        </div>

        <div className="profile-stats">
          <div>
            <span>CGPA</span>
            <strong>{Number(student.cgpa).toFixed(1)}<small>/10</small></strong>
          </div>
          <div>
            <span>Semester</span>
            <strong>{student.semester}</strong>
          </div>
        </div>

        <div className="profile-information">
          <h3>Personal information</h3>
          <p><span>Department</span><strong>{student.department}</strong></p>
          <p><span>Email</span><strong>{student.email || "Not provided"}</strong></p>
          <p><span>Phone</span><strong>{student.phone || "Not provided"}</strong></p>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => onEdit(student)}>
            Edit profile
          </button>
        </div>
      </section>
    </div>
  );
}

function readCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index++) {
    const character = line[index];

    if (character === '"' && quoted && line[index + 1] === '"') {
      current += '"';
      index++;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current.trim());
  return values;
}

function escapeCsv(value) {
  const string = String(value ?? "");
  return `"${string.replace(/"/g, '""')}"`;
}

function App() {
  const [students, setStudents] = useState(readSavedStudents);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch {
      return "light";
    }
  });

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [semester, setSemester] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [view, setView] = useState("grid");
  const [activePage, setActivePage] = useState("Overview");
  const [modal, setModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toast, setToast] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch {
      setToast("Could not save data. Browser storage may be full.");
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Theme still works for the current session.
    }
  }, [theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students
      .filter((student) => {
        const matchesSearch = [
          student.name,
          student.rollNumber,
          student.email,
          student.department,
          student.phone,
        ].some((value) => String(value || "").toLowerCase().includes(query));

        return (
          matchesSearch &&
          (department === "All" || student.department === department) &&
          (semester === "All" || student.semester === semester) &&
          (statusFilter === "All" || student.status === statusFilter)
        );
      })
      .sort((a, b) => {
        let comparison;

        if (sortBy === "cgpa") {
          comparison = Number(a.cgpa) - Number(b.cgpa);
        } else {
          comparison = String(a[sortBy] || "").localeCompare(
            String(b[sortBy] || ""),
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [students, search, department, semester, statusFilter, sortBy, sortOrder]);

  const averageCgpa = students.length
    ? students.reduce((total, student) => total + Number(student.cgpa || 0), 0) /
      students.length
    : 0;

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const topPerformers = students.filter(
    (student) => Number(student.cgpa) >= 9
  ).length;

  const departments = useMemo(() => {
    const counts = {};

    students.forEach((student) => {
      counts[student.department] = (counts[student.department] || 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [students]);

  function saveStudent(student) {
    const editing = students.some((item) => item.id === student.id);

    setStudents((previous) =>
      editing
        ? previous.map((item) => item.id === student.id ? student : item)
        : [student, ...previous]
    );

    setModal(null);
    setSelectedStudent(null);
    setToast(editing ? "Student information updated." : "Student added successfully.");
  }

  function deleteStudent(student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name} (${student.rollNumber})?`
    );

    if (!confirmed) return;

    setStudents((previous) =>
      previous.filter((item) => item.id !== student.id)
    );

    setSelectedStudent(null);
    setToast("Student record deleted.");
  }

  function openEdit(student) {
    setSelectedStudent(null);
    setModal({ type: "edit", student });
  }

  function exportCsv() {
    const headers = [
      "ID", "Name", "Roll Number", "Email", "Phone",
      "Department", "Semester", "CGPA", "Status", "Photo",
    ];

    const rows = students.map((student) => [
      student.id,
      student.name,
      student.rollNumber,
      student.email,
      student.phone,
      student.department,
      student.semester,
      student.cgpa,
      student.status,
      student.photo,
    ]);

    const csv = [
      headers,
      ...rows,
    ].map((row) => row.map(escapeCsv).join(",")).join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "studenthub-records.csv";
    link.click();
    URL.revokeObjectURL(url);

    setToast("Student records exported to CSV.");
  }

  function importCsv(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const content = String(reader.result || "").replace(/^\uFEFF/, "");
        const lines = content.split(/\r?\n/).filter((line) => line.trim());

        if (lines.length < 2) {
          setToast("CSV file has no student records.");
          return;
        }

        const headers = readCsvLine(lines[0]).map((header) =>
          header.trim().toLowerCase().replace(/[\s_-]+/g, "")
        );

        const required = ["name", "rollnumber", "department", "semester", "cgpa"];
        const missing = required.filter((header) => !headers.includes(header));

        if (missing.length) {
          setToast(`Missing CSV columns: ${missing.join(", ")}`);
          return;
        }

        const column = (row, name) => row[headers.indexOf(name)] || "";
        const imported = [];
        const seen = new Set(students.map((student) =>
          student.rollNumber.trim().toLowerCase()
        ));

        for (const line of lines.slice(1)) {
          const row = readCsvLine(line);
          const name = column(row, "name").trim();
          const rollNumber = column(row, "rollnumber").trim();
          const cgpa = Number(column(row, "cgpa"));
          const email = column(row, "email").trim();
          const phone = column(row, "phone").trim();
          const departmentValue = column(row, "department").trim();
          const semesterValue = column(row, "semester").trim();
          const statusValue = column(row, "status").trim() || "Active";
          const photo = column(row, "photo").trim();

          if (
            !name ||
            !rollNumber ||
            !departmentValue ||
            !semesterValue ||
            !Number.isFinite(cgpa) ||
            cgpa < 0 ||
            cgpa > 10 ||
            !["Active", "Inactive"].includes(statusValue) ||
            seen.has(rollNumber.toLowerCase())
          ) {
            continue;
          }

          seen.add(rollNumber.toLowerCase());

          imported.push({
            id: makeId(),
            name,
            rollNumber,
            email,
            phone,
            department: departmentValue,
            semester: semesterValue,
            cgpa,
            status: statusValue,
            photo,
          });
        }

        if (!imported.length) {
          setToast("No valid new records found. Check your CSV columns and data.");
          return;
        }

        setStudents((previous) => [...imported, ...previous]);
        setToast(`${imported.length} student record(s) imported.`);
      } catch {
        setToast("Unable to read this CSV file.");
      } finally {
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      setToast("Unable to read this file.");
      event.target.value = "";
    };

    reader.readAsText(file);
  }

  function resetDemoData() {
    if (!window.confirm("Restore the original sample students? Your current records will be replaced.")) {
      return;
    }

    setStudents(INITIAL_STUDENTS);
    setSearch("");
    setDepartment("All");
    setSemester("All");
    setStatusFilter("All");
    setToast("Sample student records restored.");
  }

  function resetFilters() {
    setSearch("");
    setDepartment("All");
    setSemester("All");
    setStatusFilter("All");
    setSortBy("name");
    setSortOrder("asc");
  }

  return (
    <div className={`app-shell ${theme === "dark" ? "dark-theme" : ""}`}>
      <aside className="sidebar">
        <a
          href="#overview"
          className="brand"
          onClick={() => setActivePage("Overview")}
        >
          <span className="brand-mark">S</span>
          <span>
            <strong>StudentHub<span className="brand-pro"> Pro</span></strong>
            <small>ACADEMIC MANAGEMENT</small>
          </span>
        </a>

        <div className="nav-label">WORKSPACE</div>

        <nav className="side-nav">
          <button
            className={`nav-item ${activePage === "Overview" ? "nav-active" : ""}`}
            onClick={() => {
              setActivePage("Overview");
              document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Icon>▦</Icon> Overview
          </button>

          <button
            className={`nav-item ${activePage === "Students" ? "nav-active" : ""}`}
            onClick={() => {
              setActivePage("Students");
              document.getElementById("students")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Icon>♙</Icon> Student directory
            <span className="nav-count">{students.length}</span>
          </button>

          <button
            className={`nav-item ${activePage === "Analytics" ? "nav-active" : ""}`}
            onClick={() => {
              setActivePage("Analytics");
              document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Icon>▥</Icon> Analytics
          </button>
        </nav>

        <div className="nav-label tools-label">DATA TOOLS</div>

        <nav className="side-nav">
          <button className="nav-item" onClick={exportCsv}>
            <Icon>⇩</Icon> Export records
          </button>

          <button
            className="nav-item"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon>⇧</Icon> Import CSV
          </button>
        </nav>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          hidden
          onChange={importCsv}
        />

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">✦</span>
            <strong>Your campus, organized.</strong>
            <p>Manage academic records from one simple dashboard.</p>
            <button onClick={resetDemoData}>Reset demo data ↗</button>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">AD</div>
            <div>
              <strong>Administrator</strong>
              <span>System manager</span>
            </div>
            <span className="admin-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <span className="system-status">
              <span className="status-dot" /> System operational
            </span>

            <button
              className="theme-button"
              onClick={() => setTheme((previous) =>
                previous === "dark" ? "light" : "dark"
              )}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>

            <button
              className="btn btn-primary top-add"
              onClick={() => setModal({ type: "add" })}
            >
              <span>＋</span> Add student
            </button>
          </div>
        </header>

        <div className="dashboard-content" id="overview">
          <section className="welcome-row">
            <div>
              <div className="eyebrow welcome-eyebrow">
                YOUR ACADEMIC WORKSPACE
              </div>
              <h1>Student overview<span>.</span></h1>
              <p>Monitor student records, academic performance, and campus activity.</p>
            </div>

            <div className="date-chip">
              <span>▦</span>
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </section>

          <section className="metrics-grid" aria-label="Student statistics">
            <MetricCard
              icon="♙"
              label="Total students"
              value={students.length}
              note="All registered records"
              color="purple"
            />
            <MetricCard
              icon="✓"
              label="Active students"
              value={activeCount}
              note={`${students.length ? Math.round(activeCount / students.length * 100) : 0}% of all students`}
              color="green"
            />
            <MetricCard
              icon="↗"
              label="Average CGPA"
              value={averageCgpa.toFixed(2)}
              note="Out of 10.00"
              color="blue"
            />
            <MetricCard
              icon="★"
              label="Top performers"
              value={topPerformers}
              note="CGPA of 9.0 or higher"
              color="orange"
            />
          </section>

          <section className="insights-grid" id="analytics">
            <article className="panel performance-panel">
              <div className="panel-heading">
                <div>
                  <h2>Department overview</h2>
                  <p>Student distribution by department</p>
                </div>
                <span className="subtle-tag">LIVE DATA</span>
              </div>

              {departments.length === 0 ? (
                <div className="empty-chart">
                  <span>▥</span>
                  <p>Add students to see department statistics.</p>
                </div>
              ) : (
                <div className="department-chart">
                  {departments.slice(0, 5).map(([name, count], index) => (
                    <div className="chart-row" key={name}>
                      <div className="chart-label">
                        <span className={`chart-dot chart-dot-${index % 5}`} />
                        <span>{name}</span>
                        <strong>{count}</strong>
                      </div>
                      <div
                        className="chart-track"
                        role="progressbar"
                        aria-label={`${name} students`}
                        aria-valuenow={count}
                        aria-valuemin={0}
                        aria-valuemax={students.length || 1}
                      >
                        <div
                          className={`chart-fill chart-fill-${index % 5}`}
                          style={{
                            width: `${students.length ? count / students.length * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="panel-footer-note">
                <span>●</span> Based on all registered students
              </div>
            </article>

            <article className="panel quick-panel">
              <div className="panel-heading">
                <div>
                  <h2>Quick actions</h2>
                  <p>Common management tasks</p>
                </div>
                <span className="quick-sparkle">✦</span>
              </div>

              <button
                className="quick-action"
                onClick={() => setModal({ type: "add" })}
              >
                <span className="quick-icon quick-purple">＋</span>
                <span><strong>Add a student</strong><small>Create a new student record</small></span>
                <b>→</b>
              </button>

              <button
                className="quick-action"
                onClick={() => {
                  setActivePage("Students");
                  document.getElementById("students")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="quick-icon quick-blue">⌕</span>
                <span><strong>Find a student</strong><small>Search and filter the directory</small></span>
                <b>→</b>
              </button>

              <button className="quick-action" onClick={exportCsv}>
                <span className="quick-icon quick-green">⇩</span>
                <span><strong>Download report</strong><small>Export records to a CSV file</small></span>
                <b>→</b>
              </button>
            </article>
          </section>

          <section className="panel directory-panel" id="students">
            <div className="directory-heading">
              <div>
                <div className="directory-title-line">
                  <h2>Student directory</h2>
                  <span className="record-count">{filteredStudents.length} records</span>
                </div>
                <p>View and manage your student information.</p>
              </div>

              <div className="directory-actions">
                <button className="btn btn-secondary" onClick={exportCsv}>
                  <span>⇩</span> Export
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setModal({ type: "add" })}
                >
                  ＋ Add student
                </button>
              </div>
            </div>

            <div className="filters">
              <label className="search-box">
                <Icon>⌕</Icon>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, roll no., email..."
                  aria-label="Search students"
                />
                {search && (
                  <button onClick={() => setSearch("")} aria-label="Clear search">×</button>
                )}
              </label>

              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                aria-label="Filter by department"
              >
                <option value="All">All departments</option>
                {DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <select
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
                aria-label="Filter by semester"
              >
                <option value="All">All semesters</option>
                {SEMESTERS.map((item) => (
                  <option key={item} value={item}>{item} semester</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="view-switch" aria-label="Directory view">
                <button
                  className={view === "grid" ? "view-active" : ""}
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  title="Grid view"
                >▦</button>
                <button
                  className={view === "table" ? "view-active" : ""}
                  onClick={() => setView("table")}
                  aria-label="Table view"
                  title="Table view"
                >☷</button>
              </div>
            </div>

            <div className="sort-bar">
              <span>
                Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students
              </span>

              <div className="sort-controls">
                <label htmlFor="sort-by">Sort by</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="rollNumber">Roll number</option>
                  <option value="department">Department</option>
                  <option value="cgpa">CGPA</option>
                  <option value="semester">Semester</option>
                </select>
                <button
                  className="sort-direction"
                  onClick={() => setSortOrder((previous) => previous === "asc" ? "desc" : "asc")}
                  aria-label="Toggle sort direction"
                  title="Toggle sort direction"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
                <button className="reset-filters" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">⌕</span>
                <h3>No students found</h3>
                <p>Try a different search or adjust your filters.</p>
                <button className="btn btn-secondary" onClick={resetFilters}>
                  Clear filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="student-grid">
                {filteredStudents.map((student) => (
                  <article className="student-card" key={student.id}>
                    <div className="student-card-top">
                      <StudentAvatar student={student} />
                      <span className={`status ${student.status === "Active" ? "status-active" : "status-inactive"}`}>
                        <span />{student.status}
                      </span>
                      <button
                        className="card-menu"
                        title="Edit student"
                        aria-label={`Edit ${student.name}`}
                        onClick={() => openEdit(student)}
                      >
                        ⋯
                      </button>
                    </div>

                    <div className="student-card-info">
                      <h3>{student.name}</h3>
                      <p className="student-roll">{student.rollNumber}</p>
                      <div className="student-department">
                        <span>▦</span> {student.department}
                      </div>
                    </div>

                    <div className="student-card-stats">
                      <div>
                        <span>SEMESTER</span>
                        <strong>{student.semester}</strong>
                      </div>
                      <div>
                        <span>CGPA</span>
                        <strong className="cgpa-value">{Number(student.cgpa).toFixed(1)} <small>/10</small></strong>
                      </div>
                    </div>

                    <div className="student-card-actions">
                      <button
                        className="view-profile"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View profile <span>→</span>
                      </button>
                      <button
                        className="edit-profile"
                        onClick={() => openEdit(student)}
                        aria-label={`Edit ${student.name}`}
                        title="Edit student"
                      >✎</button>
                      <button
                        className="delete-profile"
                        onClick={() => deleteStudent(student)}
                        aria-label={`Delete ${student.name}`}
                        title="Delete student"
                      >⌫</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="table-scroll">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>ROLL NUMBER</th>
                      <th>DEPARTMENT</th>
                      <th>SEMESTER</th>
                      <th>CGPA</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="table-student">
                            <StudentAvatar student={student} size="small" />
                            <div>
                              <strong>{student.name}</strong>
                              <span>{student.email || "No email"}</span>
                            </div>
                          </div>
                        </td>
                        <td>{student.rollNumber}</td>
                        <td>{student.department}</td>
                        <td>{student.semester}</td>
                        <td><strong className="cgpa-value">{Number(student.cgpa).toFixed(1)}</strong></td>
                        <td>
                          <span className={`status ${student.status === "Active" ? "status-active" : "status-inactive"}`}>
                            <span />{student.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button onClick={() => setSelectedStudent(student)} title="View profile">View</button>
                            <button onClick={() => openEdit(student)} title="Edit">Edit</button>
                            <button onClick={() => deleteStudent(student)} title="Delete">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="directory-footer">
              <span>StudentHub Pro · Academic records</span>
              <span>Displaying {filteredStudents.length} result(s)</span>
            </div>
          </section>

          <footer className="app-footer">
            <span>© 2026 StudentHub Pro. Built for smarter campus management.</span>
            <span><i /> All changes saved in this browser</span>
          </footer>
        </div>
      </main>

      {modal && (
        <StudentForm
          key={`${modal.type}-${modal.student?.id || "new"}`}
          initialData={modal.student}
          students={students}
          onSave={saveStudent}
          onClose={() => setModal(null)}
        />
      )}

      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEdit={openEdit}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          <span>✓</span> {toast}
          <button onClick={() => setToast("")} aria-label="Dismiss notification">×</button>
        </div>
      )}
    </div>
  );
}

export default App;
