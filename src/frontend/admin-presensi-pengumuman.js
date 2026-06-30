const PRESENSI_STORAGE_KEY = "goldenity.presensi";
const PENGUMUMAN_STORAGE_KEY = "goldenity.pengumuman";

const tabPresensiBtn = document.querySelector("#tabPresensiBtn");
const tabPengumumanBtn = document.querySelector("#tabPengumumanBtn");
const presensiPanel = document.querySelector("#presensiPanel");
const pengumumanPanel = document.querySelector("#pengumumanPanel");

const classFilter = document.querySelector("#classFilter");
const attendanceDate = document.querySelector("#attendanceDate");
const attendanceTableBody = document.querySelector("#attendanceTableBody");
const saveAttendanceBtn = document.querySelector("#saveAttendanceBtn");

const announcementForm = document.querySelector("#announcementForm");
const announcementTarget = document.querySelector("#announcementTarget");
const announcementClass = document.querySelector("#announcementClass");
const targetClassWrap = document.querySelector("#targetClassWrap");

const classRoster = {
  "XI IPA 1": [
    { id: "MURID-001", nis: "24001021", name: "Bima Pratama" },
    { id: "MURID-002", nis: "24001022", name: "Alya Maharani" },
    { id: "MURID-003", nis: "24001023", name: "Rafi Wijaya" },
  ],
  "XI IPA 2": [
    { id: "MURID-004", nis: "24001024", name: "Kevin Saputra" },
    { id: "MURID-005", nis: "24001025", name: "Nadia Putri" },
    { id: "MURID-006", nis: "24001026", name: "Ilham Ramadhan" },
  ],
  "XII IPS 1": [
    { id: "MURID-007", nis: "24001027", name: "Cindy Oktavia" },
    { id: "MURID-008", nis: "24001028", name: "Bagas Prasetyo" },
    { id: "MURID-009", nis: "24001029", name: "Nina Lestari" },
  ],
};

function getStoredArray(key) {
  const raw = localStorage.getItem(key);
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

function saveArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function switchTab(nextTab) {
  const isPresensi = nextTab === "presensi";
  tabPresensiBtn.classList.toggle("active", isPresensi);
  tabPengumumanBtn.classList.toggle("active", !isPresensi);
  presensiPanel.classList.toggle("active", isPresensi);
  pengumumanPanel.classList.toggle("active", !isPresensi);
}

function getCurrentStudents() {
  return classRoster[classFilter.value] ?? [];
}

function getCurrentPresensiEntry() {
  const allEntries = getStoredArray(PRESENSI_STORAGE_KEY);
  return allEntries.find(
    (entry) => entry.className === classFilter.value && entry.date === attendanceDate.value,
  );
}

function renderClassOptions() {
  const classNames = Object.keys(classRoster);

  classFilter.innerHTML = classNames.map((className) => `<option value="${className}">${className}</option>`).join("");
  announcementClass.innerHTML = classNames
    .map((className) => `<option value="${className}">${className}</option>`)
    .join("");
}

function createAttendanceRadio(studentId, selectedValue) {
  const options = ["Hadir", "Sakit", "Izin", "Alpa"];

  return `
    <div class="radio-group">
      ${options
        .map(
          (option) => `
            <label>
              <input
                type="radio"
                name="status-${studentId}"
                value="${option}"
                ${selectedValue === option ? "checked" : ""}
              />
              ${option}
            </label>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderAttendanceTable() {
  const students = getCurrentStudents();
  const existing = getCurrentPresensiEntry();
  const statusMap = new Map((existing?.records ?? []).map((record) => [record.studentId, record.status]));

  attendanceTableBody.innerHTML = students
    .map(
      (student) => `
        <tr data-student-id="${student.id}" data-student-name="${student.name}" data-student-nis="${student.nis}">
          <td>${student.nis}</td>
          <td>${student.name}</td>
          <td>${createAttendanceRadio(student.id, statusMap.get(student.id) ?? "Hadir")}</td>
        </tr>
      `,
    )
    .join("");
}

function collectAttendanceRecords() {
  const rows = Array.from(attendanceTableBody.querySelectorAll("tr"));

  return rows.map((row) => {
    const studentId = row.getAttribute("data-student-id") || "";
    const studentName = row.getAttribute("data-student-name") || "";
    const studentNis = row.getAttribute("data-student-nis") || "";
    const checked = row.querySelector(`input[name="status-${studentId}"]:checked`);

    return {
      studentId,
      studentName,
      studentNis,
      status: checked instanceof HTMLInputElement ? checked.value : "Hadir",
    };
  });
}

function saveAttendance() {
  if (!attendanceDate.value) {
    alert("Tanggal presensi wajib dipilih.");
    return;
  }

  const records = collectAttendanceRecords();
  const allEntries = getStoredArray(PRESENSI_STORAGE_KEY);

  const payload = {
    id: `PRS-${Date.now()}`,
    className: classFilter.value,
    date: attendanceDate.value,
    records,
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = allEntries.findIndex(
    (entry) => entry.className === classFilter.value && entry.date === attendanceDate.value,
  );

  if (existingIndex >= 0) {
    allEntries[existingIndex] = {
      ...allEntries[existingIndex],
      ...payload,
      id: allEntries[existingIndex].id,
    };
  } else {
    allEntries.push(payload);
  }

  saveArray(PRESENSI_STORAGE_KEY, allEntries);
  alert(`Presensi kelas ${classFilter.value} tanggal ${attendanceDate.value} berhasil disimpan.`);
}

function toggleTargetClass() {
  const isClassTarget = announcementTarget.value === "class";
  targetClassWrap.style.display = isClassTarget ? "grid" : "none";
}

function handleSubmitAnnouncement(event) {
  event.preventDefault();

  const formData = new FormData(announcementForm);
  const title = String(formData.get("announcementTitle") ?? "").trim();
  const message = String(formData.get("announcementMessage") ?? "").trim();
  const target = String(formData.get("announcementTarget") ?? "all");
  const targetClass = String(formData.get("announcementClass") ?? "");

  if (!title || !message) {
    alert("Judul dan isi pengumuman wajib diisi.");
    return;
  }

  if (target === "class" && !targetClass) {
    alert("Silakan pilih kelas target.");
    return;
  }

  const data = getStoredArray(PENGUMUMAN_STORAGE_KEY);
  data.unshift({
    id: `ANN-${Date.now()}`,
    title,
    message,
    targetType: target,
    targetClass: target === "class" ? targetClass : null,
    createdAt: new Date().toISOString(),
    author: "Admin/Guru",
  });

  saveArray(PENGUMUMAN_STORAGE_KEY, data);
  announcementForm.reset();
  toggleTargetClass();
  alert("Pengumuman berhasil dikirim.");
}

function initialize() {
  renderClassOptions();
  const today = new Date().toISOString().slice(0, 10);
  attendanceDate.value = today;
  renderAttendanceTable();
  toggleTargetClass();
}

tabPresensiBtn.addEventListener("click", () => switchTab("presensi"));
tabPengumumanBtn.addEventListener("click", () => switchTab("pengumuman"));
classFilter.addEventListener("change", renderAttendanceTable);
attendanceDate.addEventListener("change", renderAttendanceTable);
saveAttendanceBtn.addEventListener("click", saveAttendance);
announcementTarget.addEventListener("change", toggleTargetClass);
announcementForm.addEventListener("submit", handleSubmitAnnouncement);

initialize();
