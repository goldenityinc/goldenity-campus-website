const LAPORAN_STORAGE_KEY = "goldenity.laporanMurid";

const tableLaporanMasukBody = document.querySelector("#tableLaporanMasukBody");

function getLaporanMurid() {
  const raw = localStorage.getItem(LAPORAN_STORAGE_KEY);
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

function saveLaporanMurid(reports) {
  localStorage.setItem(LAPORAN_STORAGE_KEY, JSON.stringify(reports));
}

function toDisplayDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function createStatusBadge(statusValue) {
  const normalizedStatus = String(statusValue ?? "").toLowerCase();
  if (normalizedStatus === "selesai") {
    return '<span class="badge success">Selesai</span>';
  }

  return '<span class="badge warning">Menunggu Tanggapan</span>';
}

function renderLaporanMasuk() {
  if (!(tableLaporanMasukBody instanceof HTMLElement)) {
    return;
  }

  const reports = getLaporanMurid().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (reports.length === 0) {
    tableLaporanMasukBody.innerHTML = `
      <tr>
        <td colspan="8">Belum ada laporan murid yang masuk.</td>
      </tr>
    `;
    return;
  }

  tableLaporanMasukBody.innerHTML = reports
    .map((report) => {
      const isDone = String(report.status ?? "").toLowerCase() === "selesai";
      const actionButton = isDone
        ? "<span>-</span>"
        : `<button class="btn btn-primary" type="button" data-report-id="${report.id}">Selesaikan</button>`;

      return `
        <tr>
          <td>${toDisplayDate(report.createdAt)}</td>
          <td>${report.studentName ?? "-"}</td>
          <td>${report.className ?? "-"}</td>
          <td>${report.category ?? "-"}</td>
          <td>${report.teacherName ?? "-"}</td>
          <td>${report.reportContent ?? "-"}</td>
          <td>${createStatusBadge(report.status)}</td>
          <td>${actionButton}</td>
        </tr>
      `;
    })
    .join("");
}

if (tableLaporanMasukBody instanceof HTMLElement) {
  tableLaporanMasukBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const button = target.closest("button[data-report-id]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const reportId = button.dataset.reportId;
    if (!reportId) {
      return;
    }

    const reports = getLaporanMurid();
    const reportIndex = reports.findIndex((item) => item.id === reportId);
    if (reportIndex < 0) {
      return;
    }

    reports[reportIndex] = {
      ...reports[reportIndex],
      status: "Selesai",
      reviewedAt: new Date().toISOString(),
    };

    saveLaporanMurid(reports);
    renderLaporanMasuk();
  });
}

renderLaporanMasuk();
