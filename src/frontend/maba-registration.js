const registrationForm = document.querySelector("#mabaRegistrationForm");
const submitBtn = document.querySelector("#submitBtn");
const successModal = document.querySelector("#successModal");
const closeModalBtn = document.querySelector("#closeModalBtn");

const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";

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

function saveMabaRegistration(registration) {
  const currentRegistrations = getMabaRegistrations();
  currentRegistrations.push(registration);
  localStorage.setItem(MABA_REGISTRATION_STORAGE_KEY, JSON.stringify(currentRegistrations));
}

function openSuccessModal() {
  successModal.classList.add("show");
  successModal.setAttribute("aria-hidden", "false");
}

function closeSuccessModal() {
  successModal.classList.remove("show");
  successModal.setAttribute("aria-hidden", "true");
}

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Memproses pendaftaran...";

  const formData = new FormData(registrationForm);
  const uploadedFile = formData.get("certificateFile");

  setTimeout(() => {
    saveMabaRegistration({
      id: `${Date.now()}`,
      fullName: String(formData.get("fullName") ?? "").trim(),
      schoolOrigin: String(formData.get("schoolOrigin") ?? "").trim(),
      studyProgram: String(formData.get("studyProgram") ?? "").trim(),
      certificateFileName: uploadedFile instanceof File ? uploadedFile.name : "",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
    openSuccessModal();
    registrationForm.reset();
  }, 1500);
});

closeModalBtn.addEventListener("click", closeSuccessModal);

successModal.addEventListener("click", (event) => {
  if (event.target === successModal) {
    closeSuccessModal();
  }
});
