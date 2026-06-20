const financeChartEl = document.querySelector("#financeDonutChart");
const invoiceModal = document.querySelector("#invoiceModal");
const closeInvoiceModalBtn = document.querySelector("#closeInvoiceModalBtn");
const invoiceStudentMeta = document.querySelector("#invoiceStudentMeta");
const invoiceBreakdownBody = document.querySelector("#invoiceBreakdownBody");
const processInvoicePaymentBtn = document.querySelector("#processInvoicePaymentBtn");

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
  const breakdownRows = invoiceBreakdownMap[student.nim] ?? [];
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

document.querySelectorAll(".js-view-invoice").forEach((button) => {
  button.addEventListener("click", () => {
    openInvoiceModal({
      nim: button.dataset.nim,
      name: button.dataset.name,
      programStudy: button.dataset.programStudy,
    });
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
