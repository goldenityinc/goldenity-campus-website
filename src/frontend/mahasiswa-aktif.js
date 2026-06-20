const nimForm = document.querySelector("#nimForm");
const nimInput = document.querySelector("#nimInput");
const loginSection = document.querySelector("#loginSection");
const dashboardSection = document.querySelector("#dashboardSection");
const studentName = document.querySelector("#studentName");
const studentNim = document.querySelector("#studentNim");
const downloadTranscriptBtn = document.querySelector("#downloadTranscriptBtn");

nimForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const typedNim = nimInput.value.trim();
  if (!typedNim) {
    return;
  }

  studentName.textContent = "Nama Mahasiswa: Bima Pratama (Dummy)";
  studentNim.textContent = `NIM: ${typedNim}`;

  loginSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
});

downloadTranscriptBtn.addEventListener("click", () => {
  alert("Transkrip berhasil diunduh (simulasi).");
});
