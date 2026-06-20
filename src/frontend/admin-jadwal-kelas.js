const JADWAL_STORAGE_KEY = "goldenity.jadwalKelas";

const defaultJadwal = [
  {
    id: "jdw-1",
    programStudy: "Informatika",
    day: "Senin",
    time: "08:00 - 09:40",
    courseName: "Algoritma dan Pemrograman",
    lecturerName: "Dr. Rina Mahendra",
    room: "Lab IF-01",
    className: "IF-2A",
  },
  {
    id: "jdw-2",
    programStudy: "Sistem Informasi",
    day: "Selasa",
    time: "10:00 - 11:40",
    courseName: "Basis Data",
    lecturerName: "Ir. Dodi Prasetyo",
    room: "R-204",
    className: "SI-2B",
  },
  {
    id: "jdw-3",
    programStudy: "Teknik Komputer",
    day: "Rabu",
    time: "13:00 - 14:40",
    courseName: "Arsitektur Komputer",
    lecturerName: "M. Taufik Hidayat, M.Kom",
    room: "R-305",
    className: "TK-3A",
  },
  {
    id: "jdw-4",
    programStudy: "Informatika",
    day: "Kamis",
    time: "09:00 - 10:40",
    courseName: "Pemrograman Web",
    lecturerName: "Nadia Kurniawati, M.T.",
    room: "Lab IF-03",
    className: "IF-3B",
  },
];

const programStudyFilter = document.querySelector("#programStudyFilter");
const dayFilter = document.querySelector("#dayFilter");
const jadwalTableBody = document.querySelector("#jadwalTableBody");
const addScheduleBtn = document.querySelector("#addScheduleBtn");

function getStoredJadwal() {
  const raw = localStorage.getItem(JADWAL_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return [];
  }
}

function saveStoredJadwal(data) {
  localStorage.setItem(JADWAL_STORAGE_KEY, JSON.stringify(data));
}

function initializeJadwal() {
  const existing = getStoredJadwal();
  if (existing.length === 0) {
    saveStoredJadwal(defaultJadwal);
  }
}

function getAllJadwal() {
  return getStoredJadwal();
}

function getFilteredJadwal() {
  return getAllJadwal().filter((item) => {
    const matchesProdi =
      programStudyFilter.value === "all" || item.programStudy === programStudyFilter.value;
    const matchesDay = dayFilter.value === "all" || item.day === dayFilter.value;
    return matchesProdi && matchesDay;
  });
}

function renderProgramStudyFilter() {
  const allData = getAllJadwal();
  const uniqueProdi = [...new Set(allData.map((item) => item.programStudy))];

  const activeValue = programStudyFilter.value;
  programStudyFilter.innerHTML = '<option value="all">Semua Program Studi</option>';

  uniqueProdi.forEach((prodi) => {
    const option = document.createElement("option");
    option.value = prodi;
    option.textContent = prodi;
    programStudyFilter.appendChild(option);
  });

  if (uniqueProdi.includes(activeValue) || activeValue === "all") {
    programStudyFilter.value = activeValue;
  } else {
    programStudyFilter.value = "all";
  }
}

function renderTable() {
  const rows = getFilteredJadwal();

  if (rows.length === 0) {
    jadwalTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Tidak ada jadwal untuk filter yang dipilih.</td>
      </tr>
    `;
    return;
  }

  jadwalTableBody.innerHTML = rows
    .map(
      (item) => `
        <tr>
          <td>${item.day}, ${item.time}</td>
          <td>${item.courseName}</td>
          <td>${item.lecturerName}</td>
          <td>${item.room}</td>
          <td>${item.className}</td>
          <td>
            <button class="btn btn-danger js-delete" type="button" data-id="${item.id}">Hapus</button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function rerenderAll() {
  renderProgramStudyFilter();
  renderTable();
}

function promptRequired(question, defaultValue = "") {
  const value = prompt(question, defaultValue);
  if (value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function addScheduleFromPrompt() {
  const programStudy = promptRequired("Program Studi (contoh: Informatika)");
  if (!programStudy) {
    return;
  }

  const day = promptRequired("Hari (Senin/Jumat)", "Senin");
  if (!day) {
    return;
  }

  const time = promptRequired("Jam kuliah (contoh: 08:00 - 09:40)");
  if (!time) {
    return;
  }

  const courseName = promptRequired("Mata kuliah");
  if (!courseName) {
    return;
  }

  const lecturerName = promptRequired("Dosen pengampu");
  if (!lecturerName) {
    return;
  }

  const room = promptRequired("Ruangan", "R-101");
  if (!room) {
    return;
  }

  const className = promptRequired("Kelas", "IF-1A");
  if (!className) {
    return;
  }

  const nextData = [
    ...getAllJadwal(),
    {
      id: `jdw-${Date.now()}`,
      programStudy,
      day,
      time,
      courseName,
      lecturerName,
      room,
      className,
    },
  ];

  saveStoredJadwal(nextData);
  rerenderAll();
}

function deleteSchedule(id) {
  const nextData = getAllJadwal().filter((item) => item.id !== id);
  saveStoredJadwal(nextData);
  rerenderAll();
}

addScheduleBtn.addEventListener("click", addScheduleFromPrompt);
programStudyFilter.addEventListener("change", renderTable);
dayFilter.addEventListener("change", renderTable);

jadwalTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const deleteButton = target.closest(".js-delete");
  if (!(deleteButton instanceof HTMLButtonElement)) {
    return;
  }

  const itemId = deleteButton.dataset.id;
  if (!itemId) {
    return;
  }

  deleteSchedule(itemId);
});

initializeJadwal();
rerenderAll();
