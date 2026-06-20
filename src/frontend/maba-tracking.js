const colPending = document.querySelector("#colPending");
const colApproved = document.querySelector("#colApproved");
const colDone = document.querySelector("#colDone");

const generatedNim = new Set();
const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";
const defaultApplicants = [
  {
    id: "seed-1",
    registrationNumber: "seed-1",
    fullName: "Rafi Nuryana",
    schoolOrigin: "SMAN 3 Bandung",
    studyProgram: "Teknik Informatika",
    pipelineStatus: "pending",
    sudahBayar: false,
  },
  {
    id: "seed-2",
    registrationNumber: "seed-2",
    fullName: "Mira Puspita",
    schoolOrigin: "SMKN 1 Yogyakarta",
    studyProgram: "Sistem Informasi",
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
    const normalizedStatus = registration.status ?? "Menunggu Verifikasi";
    const normalizedPipelineStatus =
      registration.pipelineStatus ??
      (normalizedStatus === "Disetujui"
        ? "approved"
        : normalizedStatus === "Lunas"
          ? "done"
          : "pending");

    const normalizedRegistration = {
      ...registration,
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
      <button class="btn btn-primary js-approve" type="button">Approve</button>
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
      <button class="btn btn-primary js-complete-logistics" type="button">Selesaikan Logistik</button>
    </div>
  `;
}

function createDoneCard(applicant) {
  const nimValue = applicant.nim ?? "-";
  return `
    <div class="maba-card js-dynamic-card" data-registration-id="${applicant.id}" data-generated-nim="${applicant.nim}">
      <p class="maba-name">${applicant.fullName}</p>
      <p>Pilihan Prodi: ${applicant.studyProgram}</p>
      <span class="nim-pill">LUNAS & AKTIF</span>
      <span class="nim-pill badge">NIM: ${nimValue}</span>
    </div>
  `;
}

function renderKanban() {
  removeDynamicCards();

  const allApplicants = getAllApplicants();
  const pendingApplicants = allApplicants.filter((applicant) => applicant.pipelineStatus === "pending");
  const approvedApplicants = allApplicants.filter((applicant) => applicant.pipelineStatus === "approved");
  const doneApplicants = allApplicants.filter(
    (applicant) => applicant.pipelineStatus === "done" || applicant.sudahBayar === true,
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
  if (!approveBtn) {
    return;
  }

  const card = approveBtn.closest(".maba-card");
  if (!card) {
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
  if (!(completeButton instanceof HTMLButtonElement)) {
    return;
  }

  const card = completeButton.closest(".maba-card");
  if (!(card instanceof HTMLDivElement)) {
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

renderKanban();
