const registrationForm = document.querySelector("#mabaRegistrationForm");
const submitBtn = document.querySelector("#submitBtn");
const successModal = document.querySelector("#successModal");
const closeModalBtn = document.querySelector("#closeModalBtn");

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

  setTimeout(() => {
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
