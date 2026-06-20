const students = [
  {
    id: "std-1",
    nim: "231401001",
    name: "Alya Ramadani",
    programStudy: "Informatika",
    semester: 3,
    status: "Aktif",
    ips: 3.5,
    gpa: 3.25,
    grades: [
      { code: "IF301", name: "Algoritma Lanjut", credits: 3, score: 85, letter: "A" },
      { code: "IF303", name: "Pemrograman Web", credits: 3, score: 82, letter: "A-" },
      { code: "IF305", name: "Statistika", credits: 2, score: 78, letter: "B+" },
    ],
  },
  {
    id: "std-2",
    nim: "231401006",
    name: "Bima Pratama",
    programStudy: "Sistem Informasi",
    semester: 3,
    status: "Aktif",
    ips: 3.1,
    gpa: 2.84,
    grades: [
      { code: "SI301", name: "Analisis Proses Bisnis", credits: 3, score: 79, letter: "B+" },
      { code: "SI303", name: "Manajemen Basis Data", credits: 3, score: 76, letter: "B" },
      { code: "SI305", name: "Akuntansi Dasar", credits: 2, score: 81, letter: "A-" },
    ],
  },
  {
    id: "std-3",
    nim: "221401018",
    name: "Citra Maharani",
    programStudy: "Teknik Komputer",
    semester: 5,
    status: "Aktif",
    ips: 3.62,
    gpa: 3.41,
    grades: [
      { code: "TK501", name: "Embedded System", credits: 3, score: 88, letter: "A" },
      { code: "TK503", name: "Jaringan Komputer", credits: 3, score: 83, letter: "A-" },
      { code: "TK505", name: "Elektronika Digital", credits: 2, score: 80, letter: "A-" },
    ],
  },
  {
    id: "std-4",
    nim: "211401009",
    name: "Daffa Kurnia",
    programStudy: "Informatika",
    semester: 7,
    status: "Cuti",
    ips: 2.8,
    gpa: 2.67,
    grades: [
      { code: "IF701", name: "Machine Learning", credits: 3, score: 74, letter: "B" },
      { code: "IF703", name: "Rekayasa Perangkat Lunak", credits: 3, score: 71, letter: "B-" },
      { code: "IF705", name: "Data Mining", credits: 2, score: 77, letter: "B+" },
    ],
  },
  {
    id: "std-5",
    nim: "241401003",
    name: "Eka Lestari",
    programStudy: "Sistem Informasi",
    semester: 1,
    status: "Aktif",
    ips: 3.72,
    gpa: 3.72,
    grades: [
      { code: "SI101", name: "Pengantar SI", credits: 2, score: 89, letter: "A" },
      { code: "SI103", name: "Logika Informatika", credits: 2, score: 84, letter: "A-" },
      { code: "SI105", name: "Matematika Dasar", credits: 3, score: 86, letter: "A" },
    ],
  },
  {
    id: "std-6",
    nim: "221401014",
    name: "Farhan Ridho",
    programStudy: "Teknik Komputer",
    semester: 5,
    status: "Aktif",
    ips: 3.28,
    gpa: 3.12,
    grades: [
      { code: "TK507", name: "Arsitektur Komputer", credits: 3, score: 80, letter: "A-" },
      { code: "TK509", name: "Internet of Things", credits: 3, score: 78, letter: "B+" },
      { code: "TK511", name: "Sistem Mikroprosesor", credits: 2, score: 76, letter: "B" },
    ],
  },
];

const programFilter = document.querySelector("#programFilter");
const semesterFilter = document.querySelector("#semesterFilter");
const studentDirectoryTableBody = document.querySelector("#studentDirectoryTableBody");
const studentDetailModal = document.querySelector("#studentDetailModal");
const closeStudentDetailBtn = document.querySelector("#closeStudentDetailBtn");
const studentDetailMeta = document.querySelector("#studentDetailMeta");
const ipsValue = document.querySelector("#ipsValue");
const gpaValue = document.querySelector("#gpaValue");
const studentDetailGradesBody = document.querySelector("#studentDetailGradesBody");

function getFilteredStudents() {
  return students.filter((student) => {
    const matchesProgram =
      programFilter.value === "all" || student.programStudy === programFilter.value;
    const matchesSemester =
      semesterFilter.value === "all" || String(student.semester) === semesterFilter.value;

    return matchesProgram && matchesSemester;
  });
}

function renderStudentDirectory() {
  const filteredStudents = getFilteredStudents();

  if (filteredStudents.length === 0) {
    studentDirectoryTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Tidak ada mahasiswa yang cocok dengan filter saat ini.</td>
      </tr>
    `;
    return;
  }

  studentDirectoryTableBody.innerHTML = filteredStudents
    .map(
      (student) => `
        <tr>
          <td>${student.nim}</td>
          <td>${student.name}</td>
          <td>${student.programStudy}</td>
          <td>${student.semester}</td>
          <td>${student.status}</td>
          <td>
            <button class="btn btn-primary js-view-student" type="button" data-student-id="${student.id}">
              Lihat Detail
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function openStudentDetail(student) {
  studentDetailMeta.textContent = `${student.name} | ${student.nim} | ${student.programStudy} | Semester Aktif ${student.semester}`;
  ipsValue.textContent = student.ips.toFixed(2);
  gpaValue.textContent = student.gpa.toFixed(2);
  studentDetailGradesBody.innerHTML = student.grades
    .map(
      (grade) => `
        <tr>
          <td>${grade.code}</td>
          <td>${grade.name}</td>
          <td>${grade.credits}</td>
          <td>${grade.score}</td>
          <td>${grade.letter}</td>
        </tr>
      `,
    )
    .join("");

  studentDetailModal.classList.add("show");
  studentDetailModal.setAttribute("aria-hidden", "false");
}

function closeStudentDetail() {
  studentDetailModal.classList.remove("show");
  studentDetailModal.setAttribute("aria-hidden", "true");
}

programFilter.addEventListener("change", renderStudentDirectory);
semesterFilter.addEventListener("change", renderStudentDirectory);

studentDirectoryTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const detailButton = target.closest(".js-view-student");
  if (!(detailButton instanceof HTMLButtonElement)) {
    return;
  }

  const studentId = detailButton.dataset.studentId;
  const selectedStudent = students.find((student) => student.id === studentId);
  if (!selectedStudent) {
    return;
  }

  openStudentDetail(selectedStudent);
});

closeStudentDetailBtn.addEventListener("click", closeStudentDetail);
studentDetailModal.addEventListener("click", (event) => {
  if (event.target === studentDetailModal) {
    closeStudentDetail();
  }
});

renderStudentDirectory();