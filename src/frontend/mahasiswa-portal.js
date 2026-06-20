const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";

const lookupForm = document.querySelector("#lookupForm");
const lookupInput = document.querySelector("#lookupInput");
const lookupFeedback = document.querySelector("#lookupFeedback");
const lookupStep = document.querySelector("#lookupStep");
const statusStep = document.querySelector("#statusStep");
const statusTitle = document.querySelector("#statusTitle");
const statusMessage = document.querySelector("#statusMessage");
const invoiceStep = document.querySelector("#invoiceStep");
const invoiceGreeting = document.querySelector("#invoiceGreeting");
const payNowBtn = document.querySelector("#payNowBtn");
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

function hideAllResultSections() {
  statusStep.classList.add("hidden");
  invoiceStep.classList.add("hidden");
}

function showStatusResult(title, message) {
  hideAllResultSections();
  statusTitle.textContent = title;
  statusMessage.textContent = message;
  statusStep.classList.remove("hidden");
}

function showInvoiceResult(registration) {
  hideAllResultSections();
  invoiceGreeting.textContent = `Selamat, ${registration.fullName}! Pendaftaran Anda telah disetujui.`;
  invoiceStep.classList.remove("hidden");
}

lookupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = lookupInput.value.trim().toUpperCase();
  const registrations = getRegistrations();
  const foundRegistration = registrations.find((item) => (item.registrationNumber ?? "").toUpperCase() === query);

  if (!foundRegistration) {
    hideAllResultSections();
    lookupFeedback.textContent = "Data tidak ditemukan. Periksa kembali Nomor Pendaftaran Anda.";
    lookupFeedback.classList.remove("hidden");
    return;
  }

  activeRegistrationId = foundRegistration.id;
  lookupFeedback.classList.add("hidden");

  const currentStatus = foundRegistration.status ?? "Menunggu Verifikasi";
  if (currentStatus === "Menunggu Verifikasi") {
    showStatusResult(
      "Status Pendaftaran",
      "Status Anda saat ini sedang diverifikasi oleh Admin. Silakan cek kembali nanti.",
    );
    return;
  }

  if (currentStatus === "Lunas") {
    showStatusResult("Pembayaran Berhasil", "Pembayaran telah lunas. NIM Anda sedang diproses/telah aktif.");
    return;
  }

  showInvoiceResult(foundRegistration);
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
      registrations[registrationIndex].status = "Lunas";
      registrations[registrationIndex].pipelineStatus = "done";
      saveRegistrations(registrations);
    }

    payNowBtn.disabled = false;
    payNowBtn.textContent = originalLabel;

    showStatusResult("Pembayaran Berhasil", "Pembayaran telah lunas. NIM Anda sedang diproses/telah aktif.");
  }, 2000);
});
