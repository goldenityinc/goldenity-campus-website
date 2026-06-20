const nimForm = document.querySelector("#nimForm");
const nimInput = document.querySelector("#nimInput");
const loginSection = document.querySelector("#loginSection");
const dashboardSection = document.querySelector("#dashboardSection");
const studentName = document.querySelector("#studentName");
const studentNim = document.querySelector("#studentNim");
const activeSemesterInfo = document.querySelector("#activeSemesterInfo");
const downloadTranscriptBtn = document.querySelector("#downloadTranscriptBtn");

const ACTIVE_SEMESTER_STORAGE_KEY = "goldenity.activeSemester";
const DEFAULT_ACTIVE_SEMESTER = {
  tahun: "2026/2027",
  tipe: "Ganjil",
};

function getActiveSemesterLabel() {
  const savedValue = localStorage.getItem(ACTIVE_SEMESTER_STORAGE_KEY);
  if (!savedValue) {
    return `${DEFAULT_ACTIVE_SEMESTER.tahun} - ${DEFAULT_ACTIVE_SEMESTER.tipe}`;
  }

  try {
    const parsedValue = JSON.parse(savedValue);
    const tahun = parsedValue.tahun ?? DEFAULT_ACTIVE_SEMESTER.tahun;
    const tipe = parsedValue.tipe ?? DEFAULT_ACTIVE_SEMESTER.tipe;
    return `${tahun} - ${tipe}`;
  } catch (_error) {
    return `${DEFAULT_ACTIVE_SEMESTER.tahun} - ${DEFAULT_ACTIVE_SEMESTER.tipe}`;
  }
}

nimForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const typedNim = nimInput.value.trim();
  if (!typedNim) {
    return;
  }

  studentName.textContent = "Nama Mahasiswa: Bima Pratama (Dummy)";
  studentNim.textContent = `NIM: ${typedNim}`;
  activeSemesterInfo.textContent = `Semester Berjalan: ${getActiveSemesterLabel()}`;

  loginSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
});

downloadTranscriptBtn.addEventListener("click", () => {
  alert("Mendownload transkrip...");
});
