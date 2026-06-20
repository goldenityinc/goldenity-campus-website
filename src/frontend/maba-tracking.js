const colPending = document.querySelector("#colPending");
const colApproved = document.querySelector("#colApproved");
const colDone = document.querySelector("#colDone");
const detailPendaftarModal = document.querySelector("#detailPendaftarModal");
const closeDetailPendaftarBtn = document.querySelector("#closeDetailPendaftarBtn");
const detailPendaftarMeta = document.querySelector("#detailPendaftarMeta");
const detailPendaftarGrid = document.querySelector("#detailPendaftarGrid");
const detailDokumenGrid = document.querySelector("#detailDokumenGrid");
const journeyStatusList = document.querySelector("#journeyStatusList");

const generatedNim = new Set();
const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";
const defaultApplicants = [
  {
    id: "seed-1",
    registrationNumber: "seed-1",
    fullName: "Rafi Nuryana",
    schoolOrigin: "SMAN 3 Bandung",
    studyProgram: "Teknik Informatika",
    status: "Menunggu Verifikasi",
    pipelineStatus: "pending",
    sudahBayar: false,
  },
  {
    id: "seed-2",
    registrationNumber: "seed-2",
    fullName: "Mira Puspita",
    schoolOrigin: "SMKN 1 Yogyakarta",
    studyProgram: "Sistem Informasi",
    status: "Menunggu Verifikasi",
    pipelineStatus: "pending",
    sudahBayar: false,
  },
];

function getStoredRegistrations() {
  const savedValue = localStorage.getItem(MABA_REGISTRATION_STORAGE_KEY);
  if (!savedValue) {
    return [];
  }

  try {
    return JSON.parse(savedValue);
  } catch (_error) {
    return [];
  }
}

function saveStoredRegistrations(registrations) {
  localStorage.setItem(MABA_REGISTRATION_STORAGE_KEY, JSON.stringify(registrations));
}

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function derivePipelineStatus(registration) {
  const pipeline = normalizeText(registration.pipelineStatus);
  if (pipeline === "pending" || pipeline === "approved" || pipeline === "done") {
    return pipeline;
  }

  const status = normalizeText(registration.status);
  if (status.includes("lunas") || status.includes("aktif") || status.includes("selesai")) {
    return "done";
  }

  if (status.includes("setuju") || status.includes("approve")) {
    return "approved";
  }

  return "pending";
}

function syncRegistrationStatusInStorage(registrationId, nextStatus) {
  const storedRegistrations = getStoredRegistrations();
  const targetIndex = storedRegistrations.findIndex((registration) => registration.id === registrationId);

  if (targetIndex < 0) {
    return;
  }

  const updatedRegistration = {
    ...storedRegistrations[targetIndex],
    status: nextStatus,
  };

  if (nextStatus === "Disetujui") {
    updatedRegistration.pipelineStatus = "approved";
  }

  if (nextStatus === "Lunas") {
    updatedRegistration.pipelineStatus = "done";
    updatedRegistration.sudahBayar = true;
  }

  storedRegistrations[targetIndex] = updatedRegistration;
  saveStoredRegistrations(storedRegistrations);
}

function getAllApplicants() {
  const storedRegistrations = getStoredRegistrations();
  const mergedApplicants = [...defaultApplicants];

  storedRegistrations.forEach((registration) => {
    const normalizedPipelineStatus = derivePipelineStatus(registration);
    const normalizedStatus =
      registration.status ??
      (normalizedPipelineStatus === "approved"
        ? "Disetujui"
        : normalizedPipelineStatus === "done"
          ? "Lunas"
          : "Menunggu Verifikasi");

    const normalizedRegistration = {
      ...registration,
      id: registration.id ?? registration.registrationNumber ?? `${Date.now()}-${Math.random()}`,
      registrationNumber: registration.registrationNumber ?? registration.id,
      status: normalizedStatus,
      pipelineStatus: normalizedPipelineStatus,
      sudahBayar: registration.sudahBayar ?? registration.statusPembayaran === "lunas",
      nim: registration.nim ?? null,
    };

    const existingIndex = mergedApplicants.findIndex((applicant) => applicant.id === normalizedRegistration.id);
    if (existingIndex >= 0) {
      mergedApplicants[existingIndex] = normalizedRegistration;
      return;
    }

    mergedApplicants.push(normalizedRegistration);
  });

  return mergedApplicants;
}

function persistApplicant(applicantToSave) {
  const storedRegistrations = getStoredRegistrations();
  const applicantIndex = storedRegistrations.findIndex((registration) => registration.id === applicantToSave.id);

  if (applicantIndex >= 0) {
    storedRegistrations[applicantIndex] = applicantToSave;
  } else {
    storedRegistrations.push(applicantToSave);
  }

  saveStoredRegistrations(storedRegistrations);
}

function removeDynamicCards() {
  document.querySelectorAll(".js-dynamic-card").forEach((element) => {
    element.remove();
  });
}

function createPendingCard(applicant) {
  return `
    <div class="maba-card js-dynamic-card" data-registration-id="${applicant.id}">
      <p class="maba-name">${applicant.fullName}</p>
      <p>Asal Sekolah: ${applicant.schoolOrigin}</p>
      <p>Pilihan Prodi: ${applicant.studyProgram}</p>
      <div class="kanban-action-bar">
        <button class="btn-kanban-primary js-approve" type="button">
          <i class="fa-solid fa-check-circle" aria-hidden="true"></i>
          Approve
        </button>
        <button class="btn-kanban-secondary js-view-detail" type="button">
          <i class="fa-solid fa-eye" aria-hidden="true"></i>
          Lihat Detail
        </button>
      </div>
    </div>
  `;
}

function createApprovedCard(applicant) {
  return `
    <div class="maba-card js-dynamic-card" data-registration-id="${applicant.id}" data-generated-nim="${applicant.nim}">
      <p class="maba-name">${applicant.fullName}</p>
      <p>Asal Sekolah: ${applicant.schoolOrigin}</p>
      <p>Pilihan Prodi: ${applicant.studyProgram}</p>
      <span class="nim-pill">NIM: ${applicant.nim}</span>
      <div class="kanban-action-bar">
        <button class="btn-kanban-primary js-complete-logistics" type="button">
          <i class="fa-solid fa-check-circle" aria-hidden="true"></i>
          Verifikasi Daftar Ulang
        </button>
        <button class="btn-kanban-secondary js-view-detail" type="button">
          <i class="fa-solid fa-eye" aria-hidden="true"></i>
          Lihat Detail
        </button>
      </div>
    </div>
  `;
}

function createDoneCard(applicant) {
  const nimValue = applicant.nim ?? applicant.registrationNumber ?? "-";
  return `
    <div class="maba-card js-dynamic-card" data-registration-id="${applicant.id}" data-generated-nim="${applicant.nim}">
      <p class="maba-name">${applicant.fullName}</p>
      <p>Pilihan Prodi: ${applicant.studyProgram}</p>
      <span class="nim-pill">LUNAS & AKTIF</span>
      <span class="nim-pill badge">NIM: ${nimValue}</span>
      <div class="kanban-action-bar">
        <button class="btn-kanban-secondary js-view-detail" type="button">
          <i class="fa-solid fa-eye" aria-hidden="true"></i>
          Lihat Detail
        </button>
      </div>
    </div>
  `;
}

function getJourneyStep(status) {
  if (status === "Lunas") {
    return 3;
  }

  if (status === "Disetujui") {
    return 2;
  }

  return 1;
}

function openDetailPendaftarModal(applicant) {
  const normalizedStatus = applicant.status ?? "Menunggu Verifikasi";
  const journeyStep = getJourneyStep(normalizedStatus);

  detailPendaftarMeta.textContent = `${applicant.fullName} | ${applicant.registrationNumber ?? applicant.id}`;

  function makeInfoField(label, value) {
    return `
      <div class="info-field">
        <p class="info-label">${label}</p>
        <p class="info-value">${value}</p>
      </div>
    `;
  }

  detailPendaftarGrid.innerHTML =
    makeInfoField("Nama Lengkap", applicant.fullName ?? "-") +
    makeInfoField("Nomor Pendaftaran", applicant.registrationNumber ?? applicant.id ?? "-") +
    makeInfoField("Asal Sekolah", applicant.schoolOrigin ?? "-") +
    makeInfoField("Pilihan Prodi", applicant.studyProgram ?? "-");

  detailDokumenGrid.innerHTML = `
    <div class="doc-card">
      <p class="doc-card-label">Berkas Ijazah / Nilai</p>
      <a href="#" class="btn-doc">&#128196; Lihat PDF</a>
    </div>
    <div class="doc-card">
      <p class="doc-card-label">Pas Foto</p>
      <a href="#" class="btn-doc">&#128247; Lihat Foto</a>
    </div>
  `;

  const journeyItems = [
    "Menunggu Berkas",
    "Disetujui",
    "Lunas",
  ];

  journeyStatusList.innerHTML = journeyItems
    .map((item, index) => {
      const isActive = index + 1 <= journeyStep;
      return `<li class="journey-item ${isActive ? "active" : ""}">${item}</li>`;
    })
    .join("");

  detailPendaftarModal.classList.add("show");
  detailPendaftarModal.setAttribute("aria-hidden", "false");
}

function closeDetailPendaftarModal() {
  detailPendaftarModal.classList.remove("show");
  detailPendaftarModal.setAttribute("aria-hidden", "true");
}

function renderKanban() {
  removeDynamicCards();

  const allApplicants = getAllApplicants();
  const pendingApplicants = allApplicants.filter(
    (applicant) => derivePipelineStatus(applicant) === "pending",
  );
  const approvedApplicants = allApplicants.filter(
    (applicant) => derivePipelineStatus(applicant) === "approved",
  );
  const doneApplicants = allApplicants.filter(
    (applicant) => derivePipelineStatus(applicant) === "done",
  );

  colPending.insertAdjacentHTML("beforeend", pendingApplicants.map(createPendingCard).join(""));
  colApproved.insertAdjacentHTML("beforeend", approvedApplicants.map(createApprovedCard).join(""));
  colDone.insertAdjacentHTML("beforeend", doneApplicants.map(createDoneCard).join(""));
}

function createRandomNim() {
  let nim = "";

  while (!nim || generatedNim.has(nim)) {
    const suffix = String(Math.floor(Math.random() * 90 + 10));
    nim = `26100${suffix}`;
  }

  generatedNim.add(nim);
  return nim;
}

function approveCard(card) {
  const registrationId = card.dataset.registrationId;
  if (!registrationId) {
    return;
  }

  const allApplicants = getAllApplicants();
  const selectedApplicant = allApplicants.find((applicant) => applicant.id === registrationId);
  if (!selectedApplicant) {
    return;
  }

  selectedApplicant.pipelineStatus = "approved";
  selectedApplicant.status = "Disetujui";
  selectedApplicant.nim = selectedApplicant.nim ?? createRandomNim();
  persistApplicant(selectedApplicant);
  renderKanban();
}

function completeApplicantPayment(registrationId) {
  const allApplicants = getAllApplicants();
  const selectedApplicant = allApplicants.find((applicant) => applicant.id === registrationId);
  if (!selectedApplicant) {
    return;
  }

  selectedApplicant.pipelineStatus = "done";
  selectedApplicant.sudahBayar = true;
  selectedApplicant.status = "Lunas";
  selectedApplicant.nim = selectedApplicant.nim ?? createRandomNim();
  persistApplicant(selectedApplicant);
  renderKanban();
}

colPending.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const approveBtn = target.closest(".js-approve");
  const detailBtn = target.closest(".js-view-detail");
  const card = target.closest(".maba-card");
  if (!card) {
    return;
  }

  if (detailBtn) {
    const registrationIdForDetail = card.dataset.registrationId;
    if (!registrationIdForDetail) {
      return;
    }

    const selectedApplicant = getAllApplicants().find((applicant) => applicant.id === registrationIdForDetail);
    if (!selectedApplicant) {
      return;
    }

    openDetailPendaftarModal(selectedApplicant);
    return;
  }

  if (!approveBtn) {
    return;
  }

  const registrationId = card.dataset.registrationId;
  if (registrationId) {
    syncRegistrationStatusInStorage(registrationId, "Disetujui");
  }

  approveCard(card);
});

colApproved.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const completeButton = target.closest(".js-complete-logistics");
  const detailBtn = target.closest(".js-view-detail");
  const card = target.closest(".maba-card");
  if (!(card instanceof HTMLDivElement)) {
    return;
  }

  if (detailBtn) {
    const registrationIdForDetail = card.dataset.registrationId;
    if (!registrationIdForDetail) {
      return;
    }

    const selectedApplicant = getAllApplicants().find((applicant) => applicant.id === registrationIdForDetail);
    if (!selectedApplicant) {
      return;
    }

    openDetailPendaftarModal(selectedApplicant);
    return;
  }

  if (!(completeButton instanceof HTMLButtonElement)) {
    return;
  }

  if (card.dataset.staticCard === "true") {
    completeButton.remove();
    const nimBadge = card.querySelector(".nim-pill");
    const existingNim = card.dataset.generatedNim ?? "-";
    if (nimBadge) {
      nimBadge.textContent = `NIM: ${existingNim}`;
      nimBadge.classList.add("badge");
    }

    const schoolText = card.querySelector("p:nth-of-type(2)");
    if (schoolText && schoolText.textContent?.startsWith("Asal Sekolah")) {
      schoolText.remove();
    }

    const statusBadge = document.createElement("span");
    statusBadge.className = "nim-pill";
    statusBadge.textContent = "LUNAS & AKTIF";
    card.appendChild(statusBadge);

    const actionRow = card.querySelector(".kanban-action-bar");
    if (actionRow) {
      completeButton.remove();
    }

    colDone.appendChild(card);
    return;
  }

  const registrationId = card.dataset.registrationId;
  if (!registrationId) {
    return;
  }

  syncRegistrationStatusInStorage(registrationId, "Lunas");

  completeApplicantPayment(registrationId);
});

colDone.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const detailBtn = target.closest(".js-view-detail");
  if (!detailBtn) {
    return;
  }

  const card = target.closest(".maba-card");
  if (!(card instanceof HTMLDivElement)) {
    return;
  }

  const registrationId = card.dataset.registrationId;
  if (!registrationId) {
    return;
  }

  const selectedApplicant = getAllApplicants().find((applicant) => applicant.id === registrationId);
  if (!selectedApplicant) {
    return;
  }

  openDetailPendaftarModal(selectedApplicant);
});

closeDetailPendaftarBtn.addEventListener("click", closeDetailPendaftarModal);
detailPendaftarModal.addEventListener("click", (event) => {
  if (event.target === detailPendaftarModal) {
    closeDetailPendaftarModal();
  }
});

function initializeTrackingBoard() {
  getStoredRegistrations();
  renderKanban();
}

window.addEventListener("storage", renderKanban);
initializeTrackingBoard();
