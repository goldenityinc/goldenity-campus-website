const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";

const statusForm = document.querySelector("#statusForm");
const registrationNumberInput = document.querySelector("#registrationNumberInput");
const journeyCard = document.querySelector("#journeyCard");
const journeyStepper = document.querySelector("#journeyStepper");
const journeySubtitle = document.querySelector("#journeySubtitle");
const notFoundState = document.querySelector("#notFoundState");
const paymentToast = document.querySelector("#paymentToast");
const paymentToastMessage = document.querySelector("#paymentToastMessage");

let currentRegistrationKey = "";
let toastTimeoutId = null;

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

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function formatPaymentTimestamp(dateValue) {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(parsedDate);
}

function showPaymentToast(message) {
  if (!(paymentToast instanceof HTMLElement) || !(paymentToastMessage instanceof HTMLElement)) {
    return;
  }

  paymentToastMessage.textContent = message;
  paymentToast.classList.add("show");

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  toastTimeoutId = setTimeout(() => {
    paymentToast.classList.remove("show");
    toastTimeoutId = null;
  }, 3200);
}

function derivePipelineStatus(registration) {
  const pipeline = normalizeText(registration.pipelineStatus);
  if (pipeline === "pending" || pipeline === "approved" || pipeline === "done") {
    return pipeline;
  }

  const status = normalizeText(registration.status);
  const paymentStatus = normalizeText(registration.statusPembayaran);

  if (paymentStatus === "lunas" || status.includes("lunas") || status.includes("aktif")) {
    return "done";
  }

  if (status.includes("setuju") || status.includes("approve") || status.includes("diterima")) {
    return "approved";
  }

  return "pending";
}

function ensureTestSchedule(registration) {
  if (registration.testSchedule && registration.testSchedule.trim()) {
    return registration.testSchedule;
  }

  return "Test Online, 15 Juli 2026, 09:00 WIB";
}

function findRegistrationByNumber(registrationNumber) {
  const normalizedInput = normalizeText(registrationNumber);
  const registrations = getRegistrations();

  return registrations.find((item) => {
    const candidateNumber =
      item.registrationNumber ?? item.nomorPendaftaran ?? item.noPendaftaran ?? item.id ?? "";
    return normalizeText(candidateNumber) === normalizedInput;
  });
}

function updateRegistrationAsPaid(registration) {
  const registrations = getRegistrations();
  const registrationId = registration.id ?? "";
  const registrationNumber = registration.registrationNumber ?? "";

  const targetIndex = registrations.findIndex((item) => {
    const itemId = item.id ?? "";
    const itemNumber = item.registrationNumber ?? item.nomorPendaftaran ?? item.noPendaftaran ?? "";

    if (registrationId && itemId && String(itemId) === String(registrationId)) {
      return true;
    }

    return registrationNumber && String(itemNumber) === String(registrationNumber);
  });

  if (targetIndex < 0) {
    return null;
  }

  const updatedRegistration = {
    ...registrations[targetIndex],
    statusPembayaran: "lunas",
    status: "Lunas",
    pipelineStatus: "done",
    sudahBayar: true,
    paymentUpdatedAt: new Date().toISOString(),
  };

  registrations[targetIndex] = updatedRegistration;
  localStorage.setItem(MABA_REGISTRATION_STORAGE_KEY, JSON.stringify(registrations));
  return updatedRegistration;
}

function createStepItem(index, title, meta, badgeLabel, badgeType, stateClass, extraHtml = "") {
  return `
    <li class="step-item ${stateClass}">
      <span class="step-index">${index}</span>
      <div>
        <p class="step-title">${title}</p>
        <p class="step-meta">${meta}</p>
        <span class="badge ${badgeType}">${badgeLabel}</span>
        ${extraHtml}
      </div>
    </li>
  `;
}

function renderJourney(registration) {
  const fullName =
    registration.fullName ?? registration.namaLengkap ?? registration.namaPendaftar ?? "Calon Mahasiswa";
  const pipelineStatus = derivePipelineStatus(registration);
  const isAccepted = pipelineStatus === "approved" || pipelineStatus === "done";
  const hasPaid = pipelineStatus === "done" || registration.sudahBayar === true;
  const scheduleInfo = ensureTestSchedule(registration);

  const registrationKey = registration.registrationNumber ?? registration.id ?? "";
  currentRegistrationKey = String(registrationKey);
  journeySubtitle.textContent = `${fullName} - ${registrationKey}`;

  const berkasBadge = isAccepted || hasPaid ? "Berkas Lengkap" : "Pending Verifikasi";
  const berkasType = isAccepted || hasPaid ? "success" : "pending";
  const berkasState = isAccepted || hasPaid ? "is-success" : "is-active";

  const hasilLabel = isAccepted ? "Selamat! Anda Diterima" : "Sedang Diproses";
  const hasilType = isAccepted ? "success" : "pending";
  const hasilState = isAccepted ? "is-success" : "is-active";

  const daftarUlangMeta = isAccepted
    ? "Anda sudah bisa menyelesaikan proses daftar ulang dan pembayaran."
    : "Tahap ini akan terbuka setelah hasil seleksi dinyatakan diterima.";

  const paidTimestamp = formatPaymentTimestamp(registration.paymentUpdatedAt);
  const paidMeta = paidTimestamp
    ? `Pembayaran terkonfirmasi pada ${paidTimestamp} WIB.`
    : "Pembayaran terkonfirmasi.";

  const paymentButton = isAccepted && !hasPaid
    ? '<div class="payment-wrap"><button class="payment-btn js-pay-registration" type="button">Bayar Daftar Ulang</button></div>'
    : hasPaid
      ? `<div class="payment-wrap"><span class="badge success">Pembayaran Terkonfirmasi</span><p class="step-meta">${paidMeta}</p></div>`
    : "";

  journeyStepper.innerHTML = [
    createStepItem(1, "Kelengkapan Berkas", "Dokumen awal pendaftaran dan validasi administrasi.", berkasBadge, berkasType, berkasState),
    createStepItem(2, "Jadwal & Lokasi Test", scheduleInfo, "Jadwal Aktif", "success", "is-success"),
    createStepItem(3, "Hasil Seleksi", "Status hasil seleksi terbaru dari panitia PMB.", hasilLabel, hasilType, hasilState),
    createStepItem(4, "Daftar Ulang & Pembayaran", daftarUlangMeta, isAccepted ? "Siap Diproses" : "Menunggu Hasil", isAccepted ? "success" : "pending", isAccepted ? "is-active" : "", paymentButton),
  ].join("");

  journeyCard.style.display = "block";
}

function renderNotFound() {
  journeyCard.style.display = "none";
  journeyStepper.innerHTML = "";
  currentRegistrationKey = "";
  notFoundState.style.display = "block";
}

journeyStepper?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const payButton = target.closest(".js-pay-registration");
  if (!payButton || !currentRegistrationKey) {
    return;
  }

  const registration = findRegistrationByNumber(currentRegistrationKey);
  if (!registration) {
    return;
  }

  const updatedRegistration = updateRegistrationAsPaid(registration);
  if (!updatedRegistration) {
    return;
  }

  renderJourney(updatedRegistration);
  const paidAt = formatPaymentTimestamp(updatedRegistration.paymentUpdatedAt);
  showPaymentToast(
    paidAt
      ? `Pembayaran daftar ulang berhasil pada ${paidAt} WIB.`
      : "Pembayaran daftar ulang berhasil.",
  );
});

statusForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const registrationNumber = registrationNumberInput?.value ?? "";
  const foundRegistration = findRegistrationByNumber(registrationNumber);

  if (!foundRegistration) {
    renderNotFound();
    return;
  }

  notFoundState.style.display = "none";
  renderJourney(foundRegistration);
});