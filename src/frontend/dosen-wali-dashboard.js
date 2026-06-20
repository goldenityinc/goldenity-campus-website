const students = [
  {
    studentId: "1",
    nim: "231401001",
    fullName: "Alya Ramadani",
    programStudy: "Informatika",
    completedCredits: 58,
    gpa: 3.41,
    isUnderperforming: false,
    advisorLecturerId: "101",
  },
  {
    studentId: "2",
    nim: "231401006",
    fullName: "Bima Pratama",
    programStudy: "Sistem Informasi",
    completedCredits: 47,
    gpa: 1.92,
    isUnderperforming: true,
    advisorLecturerId: "101",
  },
  {
    studentId: "3",
    nim: "231401018",
    fullName: "Citra Maharani",
    programStudy: "Teknik Komputer",
    completedCredits: 62,
    gpa: 2.76,
    isUnderperforming: false,
    advisorLecturerId: "101",
  },
  {
    studentId: "4",
    nim: "231401022",
    fullName: "Daffa Kurnia",
    programStudy: "Informatika",
    completedCredits: 43,
    gpa: 1.67,
    isUnderperforming: true,
    advisorLecturerId: "101",
  },
];

const summaryCards = document.querySelector("#summaryCards");
const studentTableBody = document.querySelector("#studentTableBody");
const onlyWarningToggle = document.querySelector("#onlyWarning");
const transkripModal = document.querySelector("#transkripModal");
const closeTranskripModalBtn = document.querySelector("#closeTranskripModalBtn");
const transkripDetailMeta = document.querySelector("#transkripDetailMeta");
const transkripGradesBody = document.querySelector("#transkripGradesBody");

const ACTIVE_SEMESTER_STORAGE_KEY = "goldenity.activeSemester";
const DEFAULT_ACTIVE_SEMESTER = {
  tahun: "2026/2027",
  tipe: "Ganjil",
};

const activeDemoUser = {
  userId: "101",
  role: "dosen",
  label: "Dosen Wali",
};

const transcriptPreviewByStudentId = {
  "1": [
    { code: "IF201", name: "Struktur Data", credits: 3, score: 88, letter: "A" },
    { code: "IF203", name: "Basis Data", credits: 3, score: 84, letter: "A-" },
    { code: "IF205", name: "Kalkulus", credits: 2, score: 79, letter: "B+" },
  ],
  "2": [
    { code: "SI201", name: "Sistem Informasi Manajemen", credits: 3, score: 72, letter: "B-" },
    { code: "SI203", name: "Basis Data", credits: 3, score: 68, letter: "C+" },
    { code: "SI205", name: "Analisis Proses Bisnis", credits: 2, score: 74, letter: "B" },
  ],
  "3": [
    { code: "TK201", name: "Arsitektur Komputer", credits: 3, score: 83, letter: "A-" },
    { code: "TK203", name: "Rangkaian Digital", credits: 3, score: 78, letter: "B+" },
    { code: "TK205", name: "Jaringan Komputer", credits: 2, score: 80, letter: "A-" },
  ],
  "4": [
    { code: "IF207", name: "Pemrograman Web", credits: 3, score: 69, letter: "C+" },
    { code: "IF209", name: "Matematika Diskrit", credits: 3, score: 66, letter: "C" },
    { code: "IF211", name: "Sistem Operasi", credits: 2, score: 71, letter: "B-" },
  ],
};

function getActiveSemesterLabel() {
  const savedValue = localStorage.getItem(ACTIVE_SEMESTER_STORAGE_KEY);
  if (!savedValue) {
    return `${DEFAULT_ACTIVE_SEMESTER.tahun} - ${DEFAULT_ACTIVE_SEMESTER.tipe}`;
  }

  try {
    const parsedValue = JSON.parse(savedValue);
    const tahun = parsedValue.tahun ?? DEFAULT_ACTIVE_SEMESTER.tahun;
    const tipe = parsedValue.tipe ?? DEFAULT_ACTIVE_SEMESTER.tipe;
    return `${tahun} - ${tipe}`;
  } catch (_error) {
    return `${DEFAULT_ACTIVE_SEMESTER.tahun} - ${DEFAULT_ACTIVE_SEMESTER.tipe}`;
  }
}

function getVisibleStudents(activeUser) {
  if (activeUser.role === "dosen") {
    return students.filter((student) => student.advisorLecturerId === activeUser.userId);
  }

  return students.filter((student) => student.studentId === activeUser.userId);
}

function renderSummary(data) {
  const warningCount = data.filter((s) => s.isUnderperforming).length;
  const averageGpa =
    data.length === 0
      ? 0
      : Number((data.reduce((sum, s) => sum + s.gpa, 0) / data.length).toFixed(2));

  summaryCards.innerHTML = `
    <article class="card">
      <p class="card-label">Total Mahasiswa Perwalian</p>
      <p class="card-value">${data.length}</p>
    </article>
    <article class="card">
      <p class="card-label">Rata-rata IPK</p>
      <p class="card-value">${averageGpa}</p>
    </article>
    <article class="card">
      <p class="card-label">Underperforming Alert</p>
      <p class="card-value warn">${warningCount}</p>
    </article>
  `;
}

function createStatusBadge(student) {
  if (student.isUnderperforming) {
    return '<span class="badge badge-warning">MERAH ALERT - RISIKO</span>';
  }

  return '<span class="badge badge-ok">Aman</span>';
}

function renderTable(data) {
  if (data.length === 0) {
    studentTableBody.innerHTML = `
      <tr>
        <td colspan="7">Tidak ada data mahasiswa untuk filter ini.</td>
      </tr>
    `;
    return;
  }

  studentTableBody.innerHTML = data
    .map(
      (student) => `
      <tr class="${student.isUnderperforming ? "warning-row" : ""}">
        <td>${student.nim}</td>
        <td>${student.fullName}</td>
        <td>${student.programStudy}</td>
        <td>${student.completedCredits}</td>
        <td>${student.gpa.toFixed(2)}</td>
        <td>${createStatusBadge(student)}</td>
        <td>
          <button class="btn-detail" data-student-id="${student.studentId}">
            Lihat Detail
          </button>
          <button class="btn-transcript" data-student-id="${student.studentId}">
            Unduh Transkrip Sementara
          </button>
        </td>
      </tr>
    `,
    )
    .join("");
}

async function fetchTranscript(studentId) {
  const response = await fetch(`/api/mahasiswa/${studentId}/transkrip`, {
    method: "GET",
    headers: {
      "x-user-id": activeDemoUser.userId,
      "x-role": activeDemoUser.role,
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil transkrip (${response.status})`);
  }

  return response.json();
}

function buildTranscriptFromLocalData(student) {
  return {
    generatedAt: new Date().toISOString(),
    documentType: "temporary-transcript",
    transcript: {
      studentId: student.studentId,
      studentName: student.fullName,
      nim: student.nim,
      courses: [
        {
          courseCode: "IF201",
          courseName: "Struktur Data",
          credits: 3,
          letterGrade: student.isUnderperforming ? "C" : "A-",
        },
        {
          courseCode: "IF203",
          courseName: "Basis Data",
          credits: 3,
          letterGrade: student.isUnderperforming ? "C+" : "B+",
        },
      ],
      totalCredits: student.completedCredits,
      cumulativeGpa: student.gpa,
      isUnderperforming: student.isUnderperforming,
    },
  };
}

function downloadTranscriptPdf(payload) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const { transcript } = payload;

  doc.setFontSize(15);
  doc.text("Transkrip Nilai Sementara", 14, 18);

  doc.setFontSize(11);
  doc.text(`Nama: ${transcript.studentName}`, 14, 30);
  doc.text(`NIM: ${transcript.nim}`, 14, 37);
  doc.text(`Total SKS: ${transcript.totalCredits}`, 14, 44);
  doc.text(`IPK Kumulatif: ${Number(transcript.cumulativeGpa).toFixed(2)}`, 14, 51);
  doc.text(
    `Status Akademik: ${transcript.isUnderperforming ? "Underperforming" : "Aman"}`,
    14,
    58,
  );

  let y = 72;
  doc.setFontSize(10);
  doc.text("Kode", 14, y);
  doc.text("Mata Kuliah", 40, y);
  doc.text("SKS", 146, y);
  doc.text("Nilai", 168, y);
  y += 6;

  transcript.courses.forEach((course) => {
    if (y > 280) {
      doc.addPage();
      y = 18;
    }

    doc.text(String(course.courseCode), 14, y);
    doc.text(String(course.courseName).slice(0, 52), 40, y);
    doc.text(String(course.credits), 146, y);
    doc.text(String(course.letterGrade), 168, y);
    y += 6;
  });

  doc.save(`transkrip-sementara-${transcript.nim}.pdf`);
}

function openTranscriptModal(student) {
  const gradeRows = transcriptPreviewByStudentId[student.studentId] ?? [];
  const activeSemesterLabel = getActiveSemesterLabel();
  transkripDetailMeta.textContent = `${student.fullName} | ${student.nim} | ${student.programStudy} | Tahun Ajaran ${activeSemesterLabel}`;
  transkripGradesBody.innerHTML = gradeRows
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

  transkripModal.classList.add("show");
  transkripModal.setAttribute("aria-hidden", "false");
}

function closeTranscriptModal() {
  transkripModal.classList.remove("show");
  transkripModal.setAttribute("aria-hidden", "true");
}

async function handleTranscriptDownload(studentId) {
  const button = studentTableBody.querySelector(`[data-student-id="${studentId}"]`);
  if (button instanceof HTMLButtonElement) {
    button.disabled = true;
    button.textContent = "Memproses...";
  }

  try {
    const payload = await fetchTranscript(studentId);
    downloadTranscriptPdf(payload);
  } catch (_error) {
    const fallbackStudent = students.find((student) => student.studentId === studentId);
    if (fallbackStudent) {
      const fallbackPayload = buildTranscriptFromLocalData(fallbackStudent);
      downloadTranscriptPdf(fallbackPayload);
    } else {
      alert("Transkrip gagal diunduh.");
    }
  } finally {
    if (button instanceof HTMLButtonElement) {
      button.disabled = false;
      button.textContent = "Unduh Transkrip Sementara";
    }
  }
}

studentTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const detailButton = target.closest(".btn-detail");
  if (detailButton instanceof HTMLButtonElement) {
    const studentId = detailButton.dataset.studentId;
    const selectedStudent = students.find((student) => student.studentId === studentId);
    if (!selectedStudent) {
      return;
    }

    openTranscriptModal(selectedStudent);
    return;
  }

  const button = target.closest(".btn-transcript");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const studentId = button.dataset.studentId;
  if (!studentId) {
    return;
  }

  handleTranscriptDownload(studentId);
});

closeTranskripModalBtn.addEventListener("click", closeTranscriptModal);
transkripModal.addEventListener("click", (event) => {
  if (event.target === transkripModal) {
    closeTranscriptModal();
  }
});

function render() {
  const baseData = getVisibleStudents(activeDemoUser);
  const filteredData = onlyWarningToggle.checked
    ? baseData.filter((student) => student.isUnderperforming)
    : baseData;

  renderSummary(baseData);
  renderTable(filteredData);
}

onlyWarningToggle.addEventListener("change", render);
render();
