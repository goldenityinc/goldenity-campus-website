const MATERI_STORAGE_KEY = "goldenity.materiBelajar";
const TUGAS_STORAGE_KEY = "goldenity.tugasLMS";
const JAWABAN_STORAGE_KEY = "goldenity.jawabanTugas";

const defaultMateri = [
  {
    id: "mtr-1",
    title: "Modul Algoritma Dasar",
    courseName: "Algoritma",
    semester: 1,
    fileType: "PDF",
    uploadDate: "2026-05-16",
  },
  {
    id: "mtr-2",
    title: "Video Relasi dan Join",
    courseName: "Basis Data",
    semester: 2,
    fileType: "MP4",
    uploadDate: "2026-05-22",
  },
  {
    id: "mtr-3",
    title: "Silabus Pemrograman Web",
    courseName: "Pemrograman Web",
    semester: 3,
    fileType: "PDF",
    uploadDate: "2026-06-02",
  },
  {
    id: "mtr-4",
    title: "Rekaman Kuliah Sistem Operasi",
    courseName: "Sistem Operasi",
    semester: 4,
    fileType: "MP4",
    uploadDate: "2026-06-05",
  },
];

const courseFilter = document.querySelector("#courseFilter");
const semesterFilter = document.querySelector("#semesterFilter");
const materiTableBody = document.querySelector("#materiTableBody");
const uploadMaterialBtn = document.querySelector("#uploadMaterialBtn");
const tabMateriBtn = document.querySelector("#tabMateriBtn");
const tabTugasBtn = document.querySelector("#tabTugasBtn");
const materiPanel = document.querySelector("#materiPanel");
const tugasPanel = document.querySelector("#tugasPanel");
const taskForm = document.querySelector("#taskForm");
const taskTableBody = document.querySelector("#taskTableBody");

function getStoredMateri() {
  const raw = localStorage.getItem(MATERI_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return [];
  }
}

function getStoredTasks() {
  const raw = localStorage.getItem(TUGAS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function saveStoredTasks(data) {
  localStorage.setItem(TUGAS_STORAGE_KEY, JSON.stringify(data));
}

function getStoredAnswers() {
  const raw = localStorage.getItem(JAWABAN_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function saveStoredMateri(data) {
  localStorage.setItem(MATERI_STORAGE_KEY, JSON.stringify(data));
}

function initializeMateri() {
  const existing = getStoredMateri();
  if (existing.length === 0) {
    saveStoredMateri(defaultMateri);
  }
}

function getAllMateri() {
  return getStoredMateri();
}

function getFilteredMateri() {
  return getAllMateri().filter((item) => {
    const matchesCourse =
      courseFilter.value === "all" || item.courseName === courseFilter.value;
    const matchesSemester =
      semesterFilter.value === "all" || String(item.semester) === semesterFilter.value;

    return matchesCourse && matchesSemester;
  });
}

function renderCourseFilter() {
  const allData = getAllMateri();
  const uniqueCourses = [...new Set(allData.map((item) => item.courseName))];

  const activeValue = courseFilter.value;
  courseFilter.innerHTML = '<option value="all">Semua Mata Kuliah</option>';

  uniqueCourses.forEach((courseName) => {
    const option = document.createElement("option");
    option.value = courseName;
    option.textContent = courseName;
    courseFilter.appendChild(option);
  });

  if (uniqueCourses.includes(activeValue) || activeValue === "all") {
    courseFilter.value = activeValue;
  } else {
    courseFilter.value = "all";
  }
}

function toDisplayDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function renderTable() {
  const rows = getFilteredMateri();

  if (rows.length === 0) {
    materiTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Tidak ada materi untuk filter yang dipilih.</td>
      </tr>
    `;
    return;
  }

  materiTableBody.innerHTML = rows
    .map(
      (item) => `
        <tr>
          <td>${item.title}</td>
          <td>${item.courseName}</td>
          <td>${item.semester}</td>
          <td>${item.fileType}</td>
          <td>${toDisplayDate(item.uploadDate)}</td>
          <td>
            <button class="btn btn-secondary js-download" type="button" data-id="${item.id}">Download</button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function rerenderAll() {
  renderCourseFilter();
  renderTable();
  renderTaskTable();
}

function switchTab(nextTab) {
  const isMateri = nextTab === "materi";
  tabMateriBtn.classList.toggle("active", isMateri);
  tabTugasBtn.classList.toggle("active", !isMateri);
  materiPanel.classList.toggle("active", isMateri);
  tugasPanel.classList.toggle("active", !isMateri);
}

function renderTaskTable() {
  const tasks = getStoredTasks();
  const answers = getStoredAnswers();

  if (tasks.length === 0) {
    taskTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">Belum ada tugas dibuat.</td>
      </tr>
    `;
    return;
  }

  taskTableBody.innerHTML = tasks
    .map((task) => {
      const submissionCount = answers.filter((answer) => answer.taskId === task.id).length;

      return `
        <tr>
          <td>${task.title}</td>
          <td>${task.course}</td>
          <td>${toDisplayDate(task.deadline)}</td>
          <td>${task.description}</td>
          <td>${submissionCount}</td>
        </tr>
      `;
    })
    .join("");
}

function handleCreateTask(event) {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const title = String(formData.get("taskTitle") ?? "").trim();
  const course = String(formData.get("taskCourse") ?? "").trim();
  const deadline = String(formData.get("taskDeadline") ?? "").trim();
  const description = String(formData.get("taskDescription") ?? "").trim();

  if (!title || !course || !deadline || !description) {
    alert("Lengkapi semua field tugas.");
    return;
  }

  const nextTask = {
    id: `TASK-${Date.now()}`,
    title,
    course,
    deadline,
    description,
    createdAt: new Date().toISOString(),
  };

  saveStoredTasks([nextTask, ...getStoredTasks()]);
  taskForm.reset();
  renderTaskTable();
  alert("Tugas baru berhasil dibuat.");
}

function uploadNewMaterial() {
  const title = prompt("Masukkan Nama Materi:");
  if (!title) {
    return;
  }

  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    return;
  }

  const selectedCourse = courseFilter.value === "all" ? "Algoritma" : courseFilter.value;
  const selectedSemester =
    semesterFilter.value === "all" ? 1 : Number.parseInt(semesterFilter.value, 10);

  const nextItem = {
    id: `mtr-${Date.now()}`,
    title: normalizedTitle,
    courseName: selectedCourse,
    semester: Number.isNaN(selectedSemester) ? 1 : selectedSemester,
    fileType: "PDF",
    uploadDate: new Date().toISOString().slice(0, 10),
  };

  saveStoredMateri([...getAllMateri(), nextItem]);
  rerenderAll();
  alert("Upload materi berhasil (simulasi).");
}

function handleDownload(materialId) {
  const selected = getAllMateri().find((item) => item.id === materialId);
  if (!selected) {
    return;
  }

  alert(`Mengunduh file: ${selected.title}...`);
}

uploadMaterialBtn.addEventListener("click", uploadNewMaterial);
courseFilter.addEventListener("change", renderTable);
semesterFilter.addEventListener("change", renderTable);
tabMateriBtn.addEventListener("click", () => switchTab("materi"));
tabTugasBtn.addEventListener("click", () => switchTab("tugas"));
taskForm.addEventListener("submit", handleCreateTask);

materiTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const downloadButton = target.closest(".js-download");
  if (!(downloadButton instanceof HTMLButtonElement)) {
    return;
  }

  const materialId = downloadButton.dataset.id;
  if (!materialId) {
    return;
  }

  handleDownload(materialId);
});

initializeMateri();
rerenderAll();
switchTab("materi");
