const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";

const searchForm = document.querySelector("#searchForm");
const registrationLookup = document.querySelector("#registrationLookup");
const checkStatusBtn = document.querySelector("#checkStatusBtn");
const searchFeedback = document.querySelector("#searchFeedback");
const searchStep = document.querySelector("#searchStep");
const paymentStep = document.querySelector("#paymentStep");
const acceptedTitle = document.querySelector("#acceptedTitle");
const payNowBtn = document.querySelector("#payNowBtn");
const paymentSuccessModal = document.querySelector("#paymentSuccessModal");
const closePaymentSuccessBtn = document.querySelector("#closePaymentSuccessBtn");
const mabaSyncChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("goldenity.mabaRegistrations.sync")
    : null;

let activeRegistrationId = null;

function getRegistrations() {
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

function saveRegistrations(registrations) {
  localStorage.setItem(MABA_REGISTRATION_STORAGE_KEY, JSON.stringify(registrations));

  if (mabaSyncChannel) {
    mabaSyncChannel.postMessage("registrations-updated");
  }
}

function createRandomNim() {
  const suffix = String(Math.floor(Math.random() * 90 + 10));
  return `26100${suffix}`;
}

function openSuccessModal() {
  paymentSuccessModal.classList.add("show");
  paymentSuccessModal.setAttribute("aria-hidden", "false");
}

function closeSuccessModal() {
  paymentSuccessModal.classList.remove("show");
  paymentSuccessModal.setAttribute("aria-hidden", "true");
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const lookupValue = registrationLookup.value.trim();
  const registration = getRegistrations().find(
    (item) => item.registrationNumber === lookupValue || item.id === lookupValue,
  );

  if (!registration) {
    searchFeedback.textContent = "Data tidak ditemukan. Pastikan NIK / Nomor Pendaftaran benar.";
    searchFeedback.classList.remove("hidden");
    return;
  }

  activeRegistrationId = registration.id;
  searchFeedback.classList.add("hidden");
  searchStep.classList.add("hidden");
  paymentStep.classList.remove("hidden");
  acceptedTitle.textContent = `Selamat, ${registration.fullName}! Anda diterima di prodi ${registration.studyProgram}.`;
});

payNowBtn.addEventListener("click", () => {
  if (!activeRegistrationId) {
    return;
  }

  payNowBtn.disabled = true;
  payNowBtn.textContent = "Memproses pembayaran...";

  setTimeout(() => {
    const registrations = getRegistrations();
    const registrationIndex = registrations.findIndex((item) => item.id === activeRegistrationId);
    if (registrationIndex >= 0) {
      registrations[registrationIndex].nim = registrations[registrationIndex].nim ?? createRandomNim();
      registrations[registrationIndex].sudahBayar = true;
      registrations[registrationIndex].status = "Lunas";
      registrations[registrationIndex].statusPembayaran = "lunas";
      registrations[registrationIndex].pipelineStatus = "done";
      saveRegistrations(registrations);
    }

    payNowBtn.disabled = false;
    payNowBtn.textContent = "Bayar Online Sekarang";
    openSuccessModal();
  }, 2000);
});

closePaymentSuccessBtn.addEventListener("click", closeSuccessModal);
paymentSuccessModal.addEventListener("click", (event) => {
  if (event.target === paymentSuccessModal) {
    closeSuccessModal();
  }
});