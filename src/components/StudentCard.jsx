function StudentCard({
  name,
  rollNumber,
  department,
  semester,
  cgpa,
  photo
}) {
  return (
    <article className="student-card">

      <div className="student-image-container">
        <img
          src={photo}
          alt={`${name} profile`}
          className="student-image"
        />

        <span className="student-status">
          Active
        </span>
      </div>

      <div className="student-content">

        <h3>{name}</h3>

        <p className="roll-number">
          Roll No: {rollNumber}
        </p>

        <div className="student-details">

          <div className="detail-item">
            <span className="detail-label">
              Department
            </span>

            <strong>
              {department}
            </strong>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Semester
            </span>

            <strong>
              {semester}
            </strong>
          </div>

        </div>

        <div className="cgpa-container">

          <div>
            <span className="cgpa-label">
              Current CGPA
            </span>

            <strong className="cgpa">
              {cgpa}
            </strong>
          </div>

          <div className="cgpa-icon">
            ★
          </div>

        </div>

      </div>

    </article>
  );
}

export default StudentCard;