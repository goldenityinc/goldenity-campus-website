const openModalBtn = document.querySelector("#openModalBtn");
const modal = document.querySelector("#prodiModal");
const cancelModalBtn = document.querySelector("#cancelModalBtn");
const prodiForm = document.querySelector("#prodiForm");
const programStudyTableBody = document.querySelector("#programStudyTableBody");

const PROGRAM_STUDY_STORAGE_KEY = "goldenity.programStudies";
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

renderProgramStudies();
