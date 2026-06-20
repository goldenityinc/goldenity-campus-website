const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";

const lookupForm = document.querySelector("#lookupForm");
const lookupInput = document.querySelector("#lookupInput");
const lookupFeedback = document.querySelector("#lookupFeedback");
const lookupStep = document.querySelector("#lookupStep");
const invoiceStep = document.querySelector("#invoiceStep");
const invoiceGreeting = document.querySelector("#invoiceGreeting");
const payNowBtn = document.querySelector("#payNowBtn");

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
}

lookupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = lookupInput.value.trim();
  const registrations = getRegistrations();
  const foundRegistration = registrations.find(
    (item) => item.registrationNumber === query || item.id === query || item.nik === query,
  );

  if (!foundRegistration) {
    lookupFeedback.textContent = "Data tidak ditemukan. Periksa kembali Nomor Pendaftaran / NIK Anda.";
    lookupFeedback.classList.remove("hidden");
    return;
  }

  activeRegistrationId = foundRegistration.id;
  lookupFeedback.classList.add("hidden");
  lookupStep.classList.add("hidden");
  invoiceStep.classList.remove("hidden");
  invoiceGreeting.textContent = `Selamat, ${foundRegistration.fullName}! Anda diterima di prodi ${foundRegistration.studyProgram}.`;
});

payNowBtn.addEventListener("click", () => {
  if (!activeRegistrationId) {
    return;
  }

  const originalLabel = payNowBtn.textContent;
  payNowBtn.disabled = true;
  payNowBtn.textContent = "Memproses pembayaran...";

  setTimeout(() => {
    const registrations = getRegistrations();
    const registrationIndex = registrations.findIndex((item) => item.id === activeRegistrationId);
    if (registrationIndex >= 0) {
      registrations[registrationIndex].sudahBayar = true;
      saveRegistrations(registrations);
    }

    payNowBtn.disabled = false;
    payNowBtn.textContent = originalLabel;
    alert("Pembayaran Berhasil! Silakan cek status di menu MABA Tracking Admin");
  }, 2000);
});
