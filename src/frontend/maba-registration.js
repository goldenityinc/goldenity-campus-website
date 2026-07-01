const registrationForm = document.querySelector("#mabaRegistrationForm");
const submitBtn = document.querySelector("#submitBtn");
const modalSuccessRegistration = document.querySelector("#modalSuccessRegistration");
const generatedRegNumber = document.querySelector("#generatedRegNumber");
const btnCopyReg = document.querySelector("#btnCopyReg");
const btnGoToPortal = document.querySelector("#btnGoToPortal");
const mabaSyncChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("goldenity.mabaRegistrations.sync")
    : null;

const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";
const MABA_PUBLIC_API_ENDPOINT = "/api/public/maba-registrations";

function getMabaRegistrations() {
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

function isRegNumberExists(registrationNumber) {
  return getMabaRegistrations().some((item) => item.registrationNumber === registrationNumber);
}

async function saveMabaRegistration(registration) {
  const currentRegistrations = getMabaRegistrations();
  currentRegistrations.push(registration);
  localStorage.setItem(MABA_REGISTRATION_STORAGE_KEY, JSON.stringify(currentRegistrations));

  try {
    await fetch(MABA_PUBLIC_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registration),
    });
  } catch (_error) {
    // Keep localStorage as fallback when API is temporarily unavailable.
  }

  if (mabaSyncChannel) {
    mabaSyncChannel.postMessage("registrations-updated");
  }
}

function openSuccessModal() {
  if (!(modalSuccessRegistration instanceof HTMLElement)) {
    return;
  }

  modalSuccessRegistration.style.display = "flex";
  modalSuccessRegistration.setAttribute("aria-hidden", "false");
}

function createRegistrationNumber() {
  let nextRegistrationNumber = "";

  do {
    nextRegistrationNumber = `REG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (isRegNumberExists(nextRegistrationNumber));

  return nextRegistrationNumber;
}

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Memproses pendaftaran...";

  const formData = new FormData(registrationForm);
  const uploadedFile = formData.get("certificateFile");

  const registrationId = `${Date.now()}`;
  const registrationNumber = createRegistrationNumber();

  await saveMabaRegistration({
      id: registrationId,
      registrationNumber,
      fullName: String(formData.get("fullName") ?? "").trim(),
      schoolOrigin: String(formData.get("schoolOrigin") ?? "").trim(),
      studyProgram: String(formData.get("studyProgram") ?? "").trim(),
      certificateFileName: uploadedFile instanceof File ? uploadedFile.name : "",
      status: "Menunggu Verifikasi",
      pipelineStatus: "pending",
      sudahBayar: false,
      createdAt: new Date().toISOString(),
  });

  if (generatedRegNumber instanceof HTMLElement) {
    generatedRegNumber.textContent = registrationNumber;
  }

  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;
  openSuccessModal();
  registrationForm.reset();
});

btnCopyReg?.addEventListener("click", async () => {
  if (!(generatedRegNumber instanceof HTMLElement) || !(btnCopyReg instanceof HTMLButtonElement)) {
    return;
  }

  const originalLabel = btnCopyReg.textContent || "Salin Nomor";

  try {
    await navigator.clipboard.writeText(generatedRegNumber.textContent || "");
    btnCopyReg.textContent = "Tersalin!";
    setTimeout(() => {
      btnCopyReg.textContent = originalLabel;
    }, 1500);
  } catch (_error) {
    btnCopyReg.textContent = "Gagal Salin";
    setTimeout(() => {
      btnCopyReg.textContent = originalLabel;
    }, 1500);
  }
});

btnGoToPortal?.addEventListener("click", () => {
  window.location.href = "maba-portal.html";
});
