const financeChartEl = document.querySelector("#financeDonutChart");
const invoiceModal = document.querySelector("#invoiceModal");
const closeInvoiceModalBtn = document.querySelector("#closeInvoiceModalBtn");
const invoiceStudentMeta = document.querySelector("#invoiceStudentMeta");
const invoiceBreakdownBody = document.querySelector("#invoiceBreakdownBody");
const processInvoicePaymentBtn = document.querySelector("#processInvoicePaymentBtn");
const financeOutstandingTableBody = document.querySelector("#financeOutstandingTableBody");

const MABA_REGISTRATION_STORAGE_KEY = "goldenity.mabaRegistrations";
const REGISTRATION_TOTAL_BILL = 13500000;

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

window.addEventListener("storage", renderOutstandingTable);
renderOutstandingTable();
