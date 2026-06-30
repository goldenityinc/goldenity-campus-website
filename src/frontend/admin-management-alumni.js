const ALUMNI_STORAGE_KEY = "goldenity.alumniData";

const alumniTableBody = document.querySelector("#alumniTableBody");
const totalAlumniValue = document.querySelector("#totalAlumniValue");
const workingAlumniValue = document.querySelector("#workingAlumniValue");
const studyingAlumniValue = document.querySelector("#studyingAlumniValue");
const entrepreneurAlumniValue = document.querySelector("#entrepreneurAlumniValue");

const addAlumniBtn = document.querySelector("#addAlumniBtn");

const alumniModal = document.querySelector("#alumniModal");
const alumniModalTitle = document.querySelector("#alumniModalTitle");
const alumniModalSubtitle = document.querySelector("#alumniModalSubtitle");
const alumniModalForm = document.querySelector("#alumniModalForm");
const cancelAlumniModalBtn = document.querySelector("#cancelAlumniModalBtn");

const defaultAlumniData = [
  {
    id: "AL-001",
    graduationYear: 2021,
    name: "Dina Maharani",
    major: "Teknik Informatika",
    status: "Bekerja",
    institution: "PT Inovasi Nusantara",
  },
  {
    id: "AL-002",
    graduationYear: 2020,
    name: "Rafi Pratama",
    major: "Sistem Informasi",
    status: "Kuliah",
    institution: "Universitas Indonesia",
  },
  {
    id: "AL-003",
    graduationYear: 2022,
    name: "Meylina Putri",
    major: "Teknik Komputer",
    status: "Mencari Kerja",
    institution: "-",
  },
  {
    id: "AL-004",
    graduationYear: 2019,
    name: "Bagas Kurniawan",
    major: "Manajemen",
    status: "Wirausaha",
    institution: "BK Digital Studio",
  },
  {
    id: "AL-005",
    graduationYear: 2023,
    name: "Sinta Ayu Lestari",
    major: "Akuntansi",
    status: "Bekerja",
    institution: "PT Delta Finansia",
  },
  {
    id: "AL-006",
    graduationYear: 2021,
    name: "Hafizh Maulana",
    major: "Teknik Sipil",
    status: "Kuliah",
    institution: "Institut Teknologi Bandung",
  },
];

let modalMode = "";
let selectedAlumniId = "";

function safeParseArray(rawValue, fallbackValue) {
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : fallbackValue;
  } catch (_error) {
    return fallbackValue;
  }
}

function getAlumniData() {
  const saved = localStorage.getItem(ALUMNI_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(ALUMNI_STORAGE_KEY, JSON.stringify(defaultAlumniData));
    return [...defaultAlumniData];
  }

  return safeParseArray(saved, [...defaultAlumniData]);
}

function saveAlumniData(alumniData) {
  localStorage.setItem(ALUMNI_STORAGE_KEY, JSON.stringify(alumniData));
}

function getStatusClass(status) {
  if (status === "Bekerja") {
    return "working";
  }

  if (status === "Kuliah") {
    return "studying";
  }

  return "searching";
}

function renderSummaryWidgets(alumniData) {
  const total = alumniData.length;
  const working = alumniData.filter((item) => item.status === "Bekerja").length;
  const studying = alumniData.filter((item) => item.status === "Kuliah").length;
  const entrepreneur = alumniData.filter((item) => item.status === "Wirausaha").length;

  totalAlumniValue.textContent = String(total);
  workingAlumniValue.textContent = String(working);
  studyingAlumniValue.textContent = String(studying);
  entrepreneurAlumniValue.textContent = String(entrepreneur);
}

function renderAlumniTable() {
  const alumniData = getAlumniData();

  alumniTableBody.innerHTML = alumniData
    .map((alumni) => `
      <tr>
        <td>${alumni.graduationYear}</td>
        <td>${alumni.name}</td>
        <td>${alumni.major}</td>
        <td><span class="status-chip ${getStatusClass(alumni.status)}">${alumni.status}</span></td>
        <td>${alumni.institution || "-"}</td>
        <td>
          <button class="btn btn-secondary js-update-status" type="button" data-alumni-id="${alumni.id}">Update Status</button>
        </td>
      </tr>
    `)
    .join("");

  renderSummaryWidgets(alumniData);
}

function openModal(title, subtitle, formHtml, mode, alumniId = "") {
  modalMode = mode;
  selectedAlumniId = alumniId;
  alumniModalTitle.textContent = title;
  alumniModalSubtitle.textContent = subtitle;
  alumniModalForm.innerHTML = formHtml;
  alumniModal.classList.add("show");
  alumniModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modalMode = "";
  selectedAlumniId = "";
  alumniModal.classList.remove("show");
  alumniModal.setAttribute("aria-hidden", "true");
  alumniModalForm.innerHTML = "";
}

function openAddAlumniModal() {
  openModal(
    "Tambah Data Alumni",
    "Masukkan data alumni baru secara manual.",
    `
      <label>
        Tahun Kelulusan
        <input name="graduationYear" type="number" min="2000" max="2100" required />
      </label>
      <label>
        Nama Alumni
        <input name="name" type="text" placeholder="Contoh: Raka Firmansyah" required />
      </label>
      <label>
        Program Studi/Jurusan
        <input name="major" type="text" placeholder="Contoh: Sistem Informasi" required />
      </label>
      <label>
        Status
        <select name="status" required>
          <option value="Bekerja">Bekerja</option>
          <option value="Kuliah">Kuliah</option>
          <option value="Mencari Kerja">Mencari Kerja</option>
          <option value="Wirausaha">Wirausaha</option>
        </select>
      </label>
      <label style="grid-column: span 2;">
        Nama Perusahaan/Universitas Lanjutan
        <input name="institution" type="text" placeholder="Contoh: PT Sejahtera Digital" />
      </label>
    `,
    "add",
  );
}

function openUpdateStatusModal(alumniId) {
  const alumniData = getAlumniData();
  const alumni = alumniData.find((item) => item.id === alumniId);

  if (!alumni) {
    return;
  }

  openModal(
    `Update Status: ${alumni.name}`,
    "Perbarui status karir alumni beserta institusi lanjutan.",
    `
      <label>
        Status Karir
        <select name="status" required>
          <option value="Bekerja" ${alumni.status === "Bekerja" ? "selected" : ""}>Bekerja</option>
          <option value="Kuliah" ${alumni.status === "Kuliah" ? "selected" : ""}>Kuliah</option>
          <option value="Mencari Kerja" ${alumni.status === "Mencari Kerja" ? "selected" : ""}>Mencari Kerja</option>
          <option value="Wirausaha" ${alumni.status === "Wirausaha" ? "selected" : ""}>Wirausaha</option>
        </select>
      </label>
      <label style="grid-column: span 2;">
        Nama Perusahaan/Universitas Lanjutan
        <input name="institution" type="text" value="${alumni.institution === "-" ? "" : alumni.institution}" placeholder="Contoh: Universitas Gadjah Mada" />
      </label>
    `,
    "update",
    alumniId,
  );
}

function handleAddAlumni(formData) {
  const graduationYear = Number(formData.get("graduationYear") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const major = String(formData.get("major") ?? "").trim();
  const status = String(formData.get("status") ?? "Mencari Kerja").trim();
  const institution = String(formData.get("institution") ?? "").trim();

  if (!graduationYear || !name || !major) {
    alert("Data alumni belum lengkap.");
    return;
  }

  const alumniData = getAlumniData();
  alumniData.push({
    id: `AL-${Date.now()}`,
    graduationYear,
    name,
    major,
    status,
    institution: institution || "-",
  });

  saveAlumniData(alumniData);
  renderAlumniTable();
  closeModal();
  alert("Data alumni baru berhasil ditambahkan.");
}

function handleUpdateStatus(formData) {
  const status = String(formData.get("status") ?? "Mencari Kerja").trim();
  const institution = String(formData.get("institution") ?? "").trim();

  const alumniData = getAlumniData();
  const index = alumniData.findIndex((item) => item.id === selectedAlumniId);
  if (index === -1) {
    alert("Data alumni tidak ditemukan.");
    return;
  }

  alumniData[index].status = status;
  alumniData[index].institution = institution || "-";

  saveAlumniData(alumniData);
  renderAlumniTable();
  closeModal();
  alert("Status alumni berhasil diperbarui.");
}

alumniModalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(alumniModalForm);
  if (modalMode === "add") {
    handleAddAlumni(formData);
    return;
  }

  if (modalMode === "update") {
    handleUpdateStatus(formData);
  }
});

addAlumniBtn.addEventListener("click", openAddAlumniModal);
cancelAlumniModalBtn.addEventListener("click", closeModal);

alumniModal.addEventListener("click", (event) => {
  if (event.target === alumniModal) {
    closeModal();
  }
});

alumniTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const updateBtn = target.closest(".js-update-status");
  if (!(updateBtn instanceof HTMLButtonElement)) {
    return;
  }

  const alumniId = updateBtn.dataset.alumniId;
  if (!alumniId) {
    return;
  }

  openUpdateStatusModal(alumniId);
});

renderAlumniTable();
