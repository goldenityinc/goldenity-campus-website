const openModalBtn = document.querySelector("#openModalBtn");
const modal = document.querySelector("#prodiModal");
const cancelModalBtn = document.querySelector("#cancelModalBtn");
const prodiForm = document.querySelector("#prodiForm");
const programStudyTableBody = document.querySelector("#programStudyTableBody");
const startSemesterBtn = document.querySelector("#startSemesterBtn");
const activeSemesterInfo = document.querySelector("#activeSemesterInfo");
const activeSemesterStatus = document.querySelector("#activeSemesterStatus");
const semesterHistoryTableBody = document.querySelector("#semesterHistoryTableBody");
const modalSemesterBaru = document.querySelector("#modalSemesterBaru");
const semesterBaruForm = document.querySelector("#semesterBaruForm");
const cancelSemesterModalBtn = document.querySelector("#cancelSemesterModalBtn");
const semesterTahunAjaranInput = document.querySelector("#semesterTahunAjaran");
const semesterTipeInput = document.querySelector("#semesterTipe");
const semesterBulanMulaiInput = document.querySelector("#semesterBulanMulai");

const PROGRAM_STUDY_STORAGE_KEY = "goldenity.programStudies";
const SEMESTER_HISTORY_STORAGE_KEY = "goldenity.semesterHistory";
const ACTIVE_SEMESTER_STORAGE_KEY = "goldenity.activeSemester";
const defaultSemesterHistory = [
  {
    tahun: "2026/2027",
    tipe: "Ganjil",
    mulai: "Agustus 2026",
    status: "Berjalan",
  },
];
const defaultActiveSemester = {
  tahun: "2026/2027",
  tipe: "Ganjil",
  mulai: "Agustus 2026",
  status: "Berjalan",
};
const defaultProgramStudies = [
  {
    id: "IF",
    code: "IF",
    name: "Teknik Informatika",
    faculty: "Fakultas Teknologi Informasi",
    quota: 240,
  },
  {
    id: "SI",
    code: "SI",
    name: "Sistem Informasi",
    faculty: "Fakultas Teknologi Informasi",
    quota: 180,
  },
  {
    id: "TK",
    code: "TK",
    name: "Teknik Komputer",
    faculty: "Fakultas Teknik",
    quota: 120,
  },
];

function getProgramStudies() {
  const savedValue = localStorage.getItem(PROGRAM_STUDY_STORAGE_KEY);
  if (!savedValue) {
    localStorage.setItem(PROGRAM_STUDY_STORAGE_KEY, JSON.stringify(defaultProgramStudies));
    return [...defaultProgramStudies];
  }

  try {
    return JSON.parse(savedValue);
  } catch (_error) {
    localStorage.setItem(PROGRAM_STUDY_STORAGE_KEY, JSON.stringify(defaultProgramStudies));
    return [...defaultProgramStudies];
  }
}

function saveProgramStudies(programStudies) {
  localStorage.setItem(PROGRAM_STUDY_STORAGE_KEY, JSON.stringify(programStudies));
}

function getSemesterHistory() {
  const savedValue = localStorage.getItem(SEMESTER_HISTORY_STORAGE_KEY);
  if (!savedValue) {
    localStorage.setItem(SEMESTER_HISTORY_STORAGE_KEY, JSON.stringify(defaultSemesterHistory));
    return [...defaultSemesterHistory];
  }

  try {
    const parsedValue = JSON.parse(savedValue);
    if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
      localStorage.setItem(SEMESTER_HISTORY_STORAGE_KEY, JSON.stringify(defaultSemesterHistory));
      return [...defaultSemesterHistory];
    }

    return parsedValue.map((semester) => ({
      tahun: semester.tahun ?? defaultActiveSemester.tahun,
      tipe: semester.tipe ?? defaultActiveSemester.tipe,
      mulai: semester.mulai ?? defaultActiveSemester.mulai,
      status: semester.status === "Berjalan" ? "Berjalan" : "Selesai",
    }));
  } catch (_error) {
    localStorage.setItem(SEMESTER_HISTORY_STORAGE_KEY, JSON.stringify(defaultSemesterHistory));
    return [...defaultSemesterHistory];
  }
}

function saveSemesterHistory(semesterHistory) {
  localStorage.setItem(SEMESTER_HISTORY_STORAGE_KEY, JSON.stringify(semesterHistory));
}

function getCurrentActiveSemester(semesterHistory) {
  return semesterHistory.find((semester) => semester.status === "Berjalan") ?? semesterHistory[semesterHistory.length - 1];
}

function syncLegacyActiveSemester(activeSemester) {
  localStorage.setItem(
    ACTIVE_SEMESTER_STORAGE_KEY,
    JSON.stringify({
      tahun: activeSemester.tahun,
      tipe: activeSemester.tipe,
      mulai: activeSemester.mulai,
      status: activeSemester.status,
    }),
  );
}

function renderSemesterManagement() {
  const semesterHistory = getSemesterHistory();
  const activeSemester = getCurrentActiveSemester(semesterHistory);

  activeSemesterInfo.textContent = `Tahun Ajaran: ${activeSemester.tahun} | Tipe: ${activeSemester.tipe} | Dimulai: ${activeSemester.mulai}`;
  activeSemesterStatus.textContent = activeSemester.status;
  activeSemesterStatus.classList.toggle("done", activeSemester.status !== "Berjalan");

  semesterHistoryTableBody.innerHTML = semesterHistory
    .map(
      (semester) => `
        <tr>
          <td>${semester.tahun}</td>
          <td>${semester.tipe}</td>
          <td>${semester.mulai}</td>
          <td>
            <span class="semester-status-badge ${semester.status === "Berjalan" ? "" : "done"}">${semester.status}</span>
          </td>
        </tr>
      `,
    )
    .join("");

  syncLegacyActiveSemester(activeSemester);
}

function openSemesterModal() {
  semesterTahunAjaranInput.value = "";
  semesterTipeInput.value = "Ganjil";
  semesterBulanMulaiInput.value = "";
  modalSemesterBaru.classList.add("show");
  modalSemesterBaru.setAttribute("aria-hidden", "false");
}

function closeSemesterModal() {
  modalSemesterBaru.classList.remove("show");
  modalSemesterBaru.setAttribute("aria-hidden", "true");
}

function renderProgramStudies() {
  const programStudies = getProgramStudies();

  programStudyTableBody.innerHTML = programStudies
    .map(
      (programStudy) => `
        <tr>
          <td>${programStudy.code}</td>
          <td>${programStudy.name}</td>
          <td>${programStudy.faculty}</td>
          <td>${programStudy.quota}</td>
          <td>
            <div class="action-row">
              <button class="btn btn-secondary js-edit-program" type="button" data-program-id="${programStudy.id}">Edit</button>
              <button class="btn btn-danger js-delete-program" type="button" data-program-id="${programStudy.id}">Hapus</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

openModalBtn.addEventListener("click", openModal);
cancelModalBtn.addEventListener("click", closeModal);

prodiForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(prodiForm);
  const programStudies = getProgramStudies();

  programStudies.push({
    id: `${Date.now()}`,
    code: String(formData.get("programCode") ?? "").trim().toUpperCase(),
    name: String(formData.get("programName") ?? "").trim(),
    faculty: String(formData.get("facultyName") ?? "").trim(),
    quota: Number(formData.get("quotaMaba") ?? 0),
  });

  saveProgramStudies(programStudies);
  renderProgramStudies();
  prodiForm.reset();
  closeModal();
  alert("Data prodi baru berhasil disimpan.");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

startSemesterBtn.addEventListener("click", openSemesterModal);
cancelSemesterModalBtn.addEventListener("click", closeSemesterModal);

modalSemesterBaru.addEventListener("click", (event) => {
  if (event.target === modalSemesterBaru) {
    closeSemesterModal();
  }
});

semesterBaruForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(semesterBaruForm);
  const tahun = String(formData.get("semesterTahunAjaran") ?? "").trim();
  const tipeRaw = String(formData.get("semesterTipe") ?? "Ganjil").trim();
  const mulai = String(formData.get("semesterBulanMulai") ?? "").trim();

  if (!tahun || !mulai) {
    alert("Tahun ajaran dan bulan dimulai wajib diisi.");
    return;
  }

  const tipe = tipeRaw.toLowerCase() === "genap" ? "Genap" : "Ganjil";
  const previousSemesters = getSemesterHistory().map((semester) => ({
    ...semester,
    status: "Selesai",
  }));

  const nextSemester = {
    tahun,
    tipe,
    mulai,
    status: "Berjalan",
  };

  const updatedHistory = [...previousSemesters, nextSemester];
  saveSemesterHistory(updatedHistory);
  renderSemesterManagement();
  closeSemesterModal();
});

programStudyTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const deleteButton = target.closest(".js-delete-program");
  if (deleteButton instanceof HTMLButtonElement) {
    const programId = deleteButton.dataset.programId;
    if (!programId) {
      return;
    }

    const programStudies = getProgramStudies().filter((programStudy) => programStudy.id !== programId);
    saveProgramStudies(programStudies);
    renderProgramStudies();
    return;
  }

  const editButton = target.closest(".js-edit-program");
  if (editButton instanceof HTMLButtonElement) {
    const programId = editButton.dataset.programId;
    if (!programId) {
      return;
    }

    const programStudies = getProgramStudies();
    const programIndex = programStudies.findIndex((programStudy) => programStudy.id === programId);
    if (programIndex === -1) {
      return;
    }

    const currentQuota = programStudies[programIndex].quota;
    const nextQuotaValue = window.prompt(
      "Masukkan jumlah kuota baru untuk prodi ini:",
      String(currentQuota),
    );

    if (nextQuotaValue === null) {
      return;
    }

    const parsedQuota = Number(nextQuotaValue);
    if (!Number.isFinite(parsedQuota) || parsedQuota <= 0) {
      alert("Kuota harus berupa angka lebih dari 0.");
      return;
    }

    programStudies[programIndex].quota = parsedQuota;
    saveProgramStudies(programStudies);
    renderProgramStudies();
  }
});

renderSemesterManagement();
renderProgramStudies();
