const colPending = document.querySelector("#colPending");
const colApproved = document.querySelector("#colApproved");

const generatedNim = new Set();
const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";
const defaultPendingApplicants = [
  {
    id: "seed-1",
    fullName: "Rafi Nuryana",
    schoolOrigin: "SMAN 3 Bandung",
    studyProgram: "Teknik Informatika",
  },
  {
    id: "seed-2",
    fullName: "Mira Puspita",
    schoolOrigin: "SMKN 1 Yogyakarta",
    studyProgram: "Sistem Informasi",
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

function createPendingCard(applicant) {
  return `
    <div class="maba-card" data-registration-id="${applicant.id}">
      <p class="maba-name">${applicant.fullName}</p>
      <p>Asal Sekolah: ${applicant.schoolOrigin}</p>
      <p>Pilihan Prodi: ${applicant.studyProgram}</p>
      <button class="btn btn-primary js-approve" type="button">Approve</button>
    </div>
  `;
}

function renderPendingApplicants() {
  const storedRegistrations = getStoredRegistrations();
  const pendingApplicants = [
    ...storedRegistrations.map((registration) => ({
      id: registration.id,
      fullName: registration.fullName,
      schoolOrigin: registration.schoolOrigin,
      studyProgram: registration.studyProgram,
    })),
    ...defaultPendingApplicants,
  ];

  colPending.innerHTML = pendingApplicants.map(createPendingCard).join("");
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
  const approveBtn = card.querySelector(".js-approve");
  if (approveBtn) {
    approveBtn.remove();
  }

  const nimBadge = document.createElement("span");
  nimBadge.className = "nim-pill";
  nimBadge.textContent = `NIM: ${createRandomNim()}`;

  card.appendChild(nimBadge);
  colApproved.appendChild(card);

  const registrationId = card.dataset.registrationId;
  if (!registrationId) {
    return;
  }

  const remainingRegistrations = getStoredRegistrations().filter(
    (registration) => registration.id !== registrationId,
  );
  saveStoredRegistrations(remainingRegistrations);
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

  approveCard(card);
});

renderPendingApplicants();
