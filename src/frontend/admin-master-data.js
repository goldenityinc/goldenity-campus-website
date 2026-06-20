const openModalBtn = document.querySelector("#openModalBtn");
const modal = document.querySelector("#prodiModal");
const cancelModalBtn = document.querySelector("#cancelModalBtn");
const prodiForm = document.querySelector("#prodiForm");
const programStudyTableBody = document.querySelector("#programStudyTableBody");
const startSemesterBtn = document.querySelector("#startSemesterBtn");
const activeSemesterInfo = document.querySelector("#activeSemesterInfo");
const activeSemesterStatus = document.querySelector("#activeSemesterStatus");

const PROGRAM_STUDY_STORAGE_KEY = "goldenity.programStudies";
const ACTIVE_SEMESTER_STORAGE_KEY = "goldenity.activeSemester";
const defaultActiveSemester = {
  tahun: "2026/2027",
  tipe: "Ganjil",
  mulai: "Agustus 2026",
  status: "Aktif",
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

function getActiveSemester() {
  const savedValue = localStorage.getItem(ACTIVE_SEMESTER_STORAGE_KEY);
  if (!savedValue) {
    localStorage.setItem(ACTIVE_SEMESTER_STORAGE_KEY, JSON.stringify(defaultActiveSemester));
    return { ...defaultActiveSemester };
  }

  try {
    const parsedValue = JSON.parse(savedValue);
    return {
      tahun: parsedValue.tahun ?? defaultActiveSemester.tahun,
      tipe: parsedValue.tipe ?? defaultActiveSemester.tipe,
      mulai: parsedValue.mulai ?? defaultActiveSemester.mulai,
      status: parsedValue.status ?? defaultActiveSemester.status,
    };
  } catch (_error) {
    localStorage.setItem(ACTIVE_SEMESTER_STORAGE_KEY, JSON.stringify(defaultActiveSemester));
    return { ...defaultActiveSemester };
  }
}

function saveActiveSemester(activeSemester) {
  localStorage.setItem(ACTIVE_SEMESTER_STORAGE_KEY, JSON.stringify(activeSemester));
}

function renderActiveSemester() {
  const activeSemester = getActiveSemester();
  activeSemesterInfo.textContent = `Tahun Ajaran: ${activeSemester.tahun} | Tipe: ${activeSemester.tipe} | Dimulai: ${activeSemester.mulai}`;
  activeSemesterStatus.textContent = activeSemester.status === "Aktif" ? "Berjalan" : activeSemester.status;
}

function startNewSemester() {
  const nextTahun = window.prompt("Masukkan Tahun Ajaran Baru (contoh: 2027/2028)", "2027/2028");
  if (nextTahun === null) {
    return;
  }

  const nextTipe = window.prompt("Masukkan Tipe Semester (Ganjil/Genap)", "Genap");
  if (nextTipe === null) {
    return;
  }

  const nextMulai = window.prompt("Masukkan Bulan Dimulai (contoh: Februari 2027)", "Februari 2027");
  if (nextMulai === null) {
    return;
  }

  const cleanedTipe = String(nextTipe).trim();
  const validTipe = cleanedTipe.toLowerCase() === "genap" ? "Genap" : "Ganjil";

  const nextSemester = {
    tahun: String(nextTahun).trim() || defaultActiveSemester.tahun,
    tipe: validTipe,
    mulai: String(nextMulai).trim() || defaultActiveSemester.mulai,
    status: "Aktif",
  };

  saveActiveSemester(nextSemester);
  renderActiveSemester();
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

startSemesterBtn.addEventListener("click", startNewSemester);

renderActiveSemester();
renderProgramStudies();
