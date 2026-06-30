const financeChartEl = document.querySelector("#financeDonutChart");
const invoiceModal = document.querySelector("#invoiceModal");
const closeInvoiceModalBtn = document.querySelector("#closeInvoiceModalBtn");
const invoiceStudentMeta = document.querySelector("#invoiceStudentMeta");
const invoiceBreakdownBody = document.querySelector("#invoiceBreakdownBody");
const processInvoicePaymentBtn = document.querySelector("#processInvoicePaymentBtn");
const financeOutstandingTableBody = document.querySelector("#financeOutstandingTableBody");
const generateSppBtn = document.querySelector("#generateSppBtn");
const sppTableBody = document.querySelector("#sppTableBody");

const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";
const STUDENT_ROSTER_STORAGE_KEY = "goldenity.studentRoster";
const SPP_STORAGE_KEY = "goldenity.tagihanSPP";
const REGISTRATION_TOTAL_BILL = 13500000;
const MONTHLY_SPP_BILL = 500000;

const invoiceBreakdownMap = {
  "231401006": [
    { label: "UKT Semester Ganjil", amount: 7000000 },
    { label: "Biaya Praktikum", amount: 1500000 },
    { label: "Denda Keterlambatan", amount: 0 },
  ],
  "231401022": [
    { label: "UKT Semester Ganjil", amount: 3500000 },
    { label: "Biaya Praktikum", amount: 500000 },
    { label: "Denda Keterlambatan", amount: 250000 },
  ],
};

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStoredArray(key) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function saveStoredArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentMonthLabel() {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function getActiveStudents() {
  const roster = getStoredArray(STUDENT_ROSTER_STORAGE_KEY);
  if (roster.length > 0) {
    const mapped = roster.map((student) => ({
      id: student.id ?? `STD-${student.nis}`,
      name: student.name ?? "Murid",
      className: student.classLevel ?? "Kelas X",
    }));

    if (!mapped.some((student) => student.id === "MURID-001")) {
      mapped.unshift({ id: "MURID-001", name: "Bima Pratama", className: "XI IPA 1" });
    }

    return mapped;
  }

  return [
    { id: "MURID-001", name: "Bima Pratama", className: "XI IPA 1" },
    { id: "MURID-002", name: "Alya Maharani", className: "XI IPA 1" },
    { id: "MURID-003", name: "Rafi Wijaya", className: "XI IPA 1" },
    { id: "MURID-004", name: "Kevin Saputra", className: "XI IPA 2" },
  ];
}

function getSppBills() {
  return getStoredArray(SPP_STORAGE_KEY);
}

function saveSppBills(data) {
  saveStoredArray(SPP_STORAGE_KEY, data);
}

function renderSppTable() {
  const rows = getSppBills();

  if (rows.length === 0) {
    sppTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">Belum ada tagihan SPP. Silakan klik tombol generate.</td>
      </tr>
    `;
    return;
  }

  sppTableBody.innerHTML = rows
    .map(
      (bill) => `
        <tr>
          <td>${bill.studentName}</td>
          <td>${bill.className}</td>
          <td>${formatCurrency(bill.amount)}</td>
          <td>${bill.status}</td>
          <td>
            ${
              bill.status === "Lunas"
                ? '<button class="btn btn-secondary" type="button" disabled>Sudah Lunas</button>'
                : `<button class="btn btn-primary js-mark-spp-paid" type="button" data-id="${bill.id}">Tandai Lunas</button>`
            }
          </td>
        </tr>
      `,
    )
    .join("");
}

function generateMonthlySpp() {
  const activeStudents = getActiveStudents();
  const currentMonth = getCurrentMonthLabel();
  const existing = getSppBills();

  const existingByMonth = existing.filter((bill) => bill.monthLabel === currentMonth);
  const nonCurrentMonth = existing.filter((bill) => bill.monthLabel !== currentMonth);
  const existingIds = new Set(existingByMonth.map((bill) => bill.studentId));

  const newBills = activeStudents
    .filter((student) => !existingIds.has(student.id))
    .map((student) => ({
      id: `SPP-${student.id}-${new Date().getTime()}`,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      monthLabel: currentMonth,
      amount: MONTHLY_SPP_BILL,
      status: "Belum Lunas",
      createdAt: new Date().toISOString(),
    }));

  const merged = [...nonCurrentMonth, ...existingByMonth, ...newBills];
  saveSppBills(merged);
  renderSppTable();
  alert(`Tagihan SPP ${currentMonth} berhasil digenerate (${merged.length} murid).`);
}

function markSppAsPaid(billId) {
  const rows = getSppBills();
  const index = rows.findIndex((bill) => bill.id === billId);
  if (index < 0) {
    return;
  }

  rows[index].status = "Lunas";
  rows[index].paidAt = new Date().toISOString();
  saveSppBills(rows);
  renderSppTable();
}

function closeInvoiceModal() {
  invoiceModal.classList.remove("show");
  invoiceModal.setAttribute("aria-hidden", "true");
}

function openInvoiceModal(student) {
  const breakdownRows =
    invoiceBreakdownMap[student.nim] ?? [
      { label: "UKT Semester 1", amount: 7500000 },
      { label: "Uang Pangkal", amount: 5000000 },
      { label: "Almamater & KTM", amount: 1000000 },
    ];
  const totalAmount = breakdownRows.reduce((sum, row) => sum + row.amount, 0);

  invoiceStudentMeta.textContent = `${student.name} | ${student.nim} | ${student.programStudy}`;
  invoiceBreakdownBody.innerHTML = [
    ...breakdownRows.map(
      (row) => `
        <tr>
          <td>${row.label}</td>
          <td>${formatCurrency(row.amount)}</td>
        </tr>
      `,
    ),
    `
      <tr>
        <td><strong>Total Tagihan</strong></td>
        <td><strong>${formatCurrency(totalAmount)}</strong></td>
      </tr>
    `,
  ].join("");

  invoiceModal.classList.add("show");
  invoiceModal.setAttribute("aria-hidden", "false");
}

function getStoredRegistrations() {
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

function loadOutstandingMabaRegistrations() {
  return getStoredRegistrations().filter((registration) => {
    const status = registration.status ?? "Menunggu Verifikasi";
    return status === "Menunggu Verifikasi" || status === "Disetujui";
  });
}

function renderOutstandingTable() {
  const rows = loadOutstandingMabaRegistrations();

  if (rows.length === 0) {
    financeOutstandingTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Belum ada tagihan pendaftar yang menunggu pembayaran.</td>
      </tr>
    `;
    return;
  }

  financeOutstandingTableBody.innerHTML = rows
    .map(
      (registration) => `
      <tr>
        <td>${registration.nim ?? registration.registrationNumber ?? "-"}</td>
        <td>${registration.fullName ?? "-"}</td>
        <td>${registration.studyProgram ?? "-"}</td>
        <td><span class="badge badge-danger">Belum Dibayar</span></td>
        <td>${formatCurrency(REGISTRATION_TOTAL_BILL)}</td>
        <td>
          <button
            class="btn btn-primary js-view-invoice"
            type="button"
            data-nim="${registration.nim ?? registration.registrationNumber ?? "-"}"
            data-name="${registration.fullName ?? "-"}"
            data-program-study="${registration.studyProgram ?? "-"}"
          >
            Lihat Rincian Tagihan
          </button>
        </td>
      </tr>
    `,
    )
    .join("");
}

new Chart(financeChartEl, {
  type: "doughnut",
  data: {
    labels: ["Lunas", "Tunggakan"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#1a9a57", "#d42828"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 3,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 14,
          boxHeight: 14,
          usePointStyle: true,
        },
      },
    },
    cutout: "62%",
  },
});

financeOutstandingTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest(".js-view-invoice");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  openInvoiceModal({
    nim: button.dataset.nim,
    name: button.dataset.name,
    programStudy: button.dataset.programStudy,
  });
});

closeInvoiceModalBtn.addEventListener("click", closeInvoiceModal);
invoiceModal.addEventListener("click", (event) => {
  if (event.target === invoiceModal) {
    closeInvoiceModal();
  }
});

processInvoicePaymentBtn.addEventListener("click", () => {
  alert("Pembayaran berhasil diverifikasi!");
  closeInvoiceModal();
});

generateSppBtn?.addEventListener("click", generateMonthlySpp);

sppTableBody?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest(".js-mark-spp-paid");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const billId = button.dataset.id;
  if (!billId) {
    return;
  }

  markSppAsPaid(billId);
});

window.addEventListener("storage", renderOutstandingTable);
renderOutstandingTable();
renderSppTable();
