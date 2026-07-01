const digitalClock = document.querySelector("#digitalClock");
const joinButtons = document.querySelectorAll(".js-join-class");
const gradeProgressChartCanvas = document.querySelector("#gradeProgressChart");
const announcementList = document.querySelector("#announcementList");
const attendancePercentText = document.querySelector("#attendancePercentText");
const attendanceMeterBar = document.querySelector("#attendanceMeterBar");
const billingCardContainer = document.querySelector("#billingCardContainer");
const studentTaskList = document.querySelector("#studentTaskList");
const taskSubmitModal = document.querySelector("#taskSubmitModal");
const taskSubmitSubtitle = document.querySelector("#taskSubmitSubtitle");
const taskSubmitForm = document.querySelector("#taskSubmitForm");
const taskAnswerInput = document.querySelector("#taskAnswerInput");
const taskFileInput = document.querySelector("#taskFileInput");
const cancelTaskSubmitBtn = document.querySelector("#cancelTaskSubmitBtn");
const studentReportForm = document.querySelector("#studentReportForm");
const studentReportHistoryBody = document.querySelector("#studentReportHistoryBody");
const contentSections = document.querySelectorAll(".content-section");
const sidebarMenuLinks = document.querySelectorAll(".nav-group .nav-link[data-section-target]");

const PENGUMUMAN_STORAGE_KEY = "goldenity.pengumuman";
const PRESENSI_STORAGE_KEY = "goldenity.presensi";
const TAGIHAN_SPP_KEY = "goldenity.tagihanSPP";
const TUGAS_STORAGE_KEY = "goldenity.tugasLMS";
const JAWABAN_STORAGE_KEY = "goldenity.jawabanTugas";
const LAPORAN_MURID_STORAGE_KEY = "goldenity.laporanMurid";

const STUDENT_PROFILE = {
  id: "MURID-001",
  name: "Bima Pratama",
  className: "XI IPA 1",
};

let selectedTaskId = "";

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

function toDisplayDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function updateClock() {
  if (!(digitalClock instanceof HTMLElement)) {
    return;
  }

  const now = new Date();
  const formattedTime = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  digitalClock.textContent = `Waktu server sekolah: ${formattedTime}`;
}

function switchSection(targetSectionId) {
  if (!targetSectionId) {
    return;
  }

  contentSections.forEach((section) => {
    if (!(section instanceof HTMLElement)) {
      return;
    }

    const shouldShow = section.id === targetSectionId;
    section.classList.toggle("active", shouldShow);
  });

  sidebarMenuLinks.forEach((link) => {
    if (!(link instanceof HTMLElement)) {
      return;
    }

    const isActive = link.getAttribute("data-section-target") === targetSectionId;
    link.classList.toggle("active", isActive);
  });
}

function registerSidebarNavigation() {
  sidebarMenuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetSectionId = link.getAttribute("data-section-target") || "section-dashboard";
      switchSection(targetSectionId);
    });
  });

  switchSection("section-dashboard");
}

function registerJoinButtons() {
  joinButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const subject = button.getAttribute("data-subject") || "kelas";
      alert(`Menghubungkan ke Virtual Class untuk ${subject}...`);
    });
  });
}

function renderAnnouncementBoard() {
  if (!(announcementList instanceof HTMLElement)) {
    return;
  }

  const announcements = getStoredArray(PENGUMUMAN_STORAGE_KEY).filter((item) => {
    if (item.targetType === "all") {
      return true;
    }

    return item.targetType === "class" && item.targetClass === STUDENT_PROFILE.className;
  });

  if (announcements.length === 0) {
    announcementList.innerHTML = '<p style="margin:0;color:#55708b;">Belum ada pengumuman untuk kelas Anda.</p>';
    return;
  }

  announcementList.innerHTML = announcements
    .slice(0, 6)
    .map(
      (item) => `
        <article class="announcement-item">
          <h4>${item.title}</h4>
          <p>${item.message}</p>
          <p class="announcement-meta">${toDisplayDate(item.createdAt)} | ${item.targetType === "all" ? "Semua Murid" : item.targetClass}</p>
        </article>
      `,
    )
    .join("");
}

function renderAttendanceWidget() {
  if (!(attendancePercentText instanceof HTMLElement) || !(attendanceMeterBar instanceof HTMLElement)) {
    return;
  }

  const presensi = getStoredArray(PRESENSI_STORAGE_KEY);
  const studentRecords = presensi.flatMap((entry) =>
    (entry.records ?? []).filter((record) => record.studentId === STUDENT_PROFILE.id),
  );

  if (studentRecords.length === 0) {
    attendancePercentText.textContent = "95%";
    attendanceMeterBar.style.width = "95%";
    return;
  }

  const hadirCount = studentRecords.filter((record) => record.status === "Hadir").length;
  const percentage = Math.round((hadirCount / studentRecords.length) * 100);

  attendancePercentText.textContent = `${percentage}%`;
  attendanceMeterBar.style.width = `${percentage}%`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function renderBillingSection() {
  if (!(billingCardContainer instanceof HTMLElement)) {
    return;
  }

  const bills = getStoredArray(TAGIHAN_SPP_KEY);
  const studentBill = bills.find((bill) => {
    if (bill.status === "Lunas") {
      return false;
    }

    return (
      bill.studentId === STUDENT_PROFILE.id ||
      (bill.studentName === STUDENT_PROFILE.name && bill.className === STUDENT_PROFILE.className)
    );
  });

  if (!studentBill) {
    billingCardContainer.innerHTML = `
      <article class="task-card">
        <div class="task-footer">
          <div>
            <h4 style="margin:0 0 6px;">Tagihan Belum Dibayar</h4>
            <p style="margin:0;color:#4f6b85;">Tidak ada tagihan aktif. Status keuangan Anda saat ini <span class="badge success">Lunas</span>.</p>
          </div>
        </div>
      </article>
    `;
    return;
  }

  billingCardContainer.innerHTML = `
    <article class="task-card">
      <h4 style="margin:0 0 6px;">Tagihan Belum Dibayar: SPP ${studentBill.monthLabel ?? "Bulan Ini"}</h4>
      <p style="margin:0;">Nominal: <strong>${formatCurrency(studentBill.amount ?? 500000)}</strong></p>
      <div class="task-footer">
        <span class="badge warning">${studentBill.status}</span>
        <button class="join-btn" id="paySppBtn" type="button">Bayar Online</button>
      </div>
    </article>
  `;

  const payButton = document.querySelector("#paySppBtn");
  payButton?.addEventListener("click", () => processSppPayment(studentBill.id));
}

function processSppPayment(billId) {
  alert("Menghubungkan ke payment gateway... mohon tunggu.");

  setTimeout(() => {
    const bills = getStoredArray(TAGIHAN_SPP_KEY);
    const index = bills.findIndex((bill) => bill.id === billId);
    if (index < 0) {
      return;
    }

    bills[index].status = "Lunas";
    bills[index].paidAt = new Date().toISOString();
    saveStoredArray(TAGIHAN_SPP_KEY, bills);
    renderBillingSection();
    alert("Pembayaran SPP berhasil. Tagihan Anda telah lunas.");
  }, 900);
}

function getSubmittedTaskIds() {
  return new Set(
    getStoredArray(JAWABAN_STORAGE_KEY)
      .filter((item) => item.studentId === STUDENT_PROFILE.id)
      .map((item) => item.taskId),
  );
}

function renderTaskSection() {
  if (!(studentTaskList instanceof HTMLElement)) {
    return;
  }

  const tasks = getStoredArray(TUGAS_STORAGE_KEY);
  const submittedTaskIds = getSubmittedTaskIds();

  if (tasks.length === 0) {
    studentTaskList.innerHTML = '<p style="margin:0;color:#55708b;">Belum ada tugas dari guru.</p>';
    return;
  }

  studentTaskList.innerHTML = tasks
    .map((task) => {
      const submitted = submittedTaskIds.has(task.id);

      return `
        <article class="task-card">
          <h4>${task.title}</h4>
          <p><strong>Mata Pelajaran:</strong> ${task.course}</p>
          <p><strong>Deadline:</strong> ${toDisplayDate(task.deadline)}</p>
          <p>${task.description}</p>
          <div class="task-footer">
            <span class="badge ${submitted ? "success" : "warning"}">
              ${submitted ? "Tugas Selesai / Menunggu Nilai" : "Belum Dikerjakan"}
            </span>
            ${
              submitted
                ? '<button class="btn-secondary" type="button" disabled>Sudah Submit</button>'
                : `<button class="join-btn js-open-submit" type="button" data-task-id="${task.id}" data-task-title="${task.title}">Kerjakan/Submit</button>`
            }
          </div>
        </article>
      `;
    })
    .join("");
}

function openSubmitModal(taskId, taskTitle) {
  selectedTaskId = taskId;
  if (taskSubmitSubtitle instanceof HTMLElement) {
    taskSubmitSubtitle.textContent = `Tugas: ${taskTitle}`;
  }

  taskAnswerInput.value = "";
  taskFileInput.value = "";
  taskSubmitModal.classList.add("show");
  taskSubmitModal.setAttribute("aria-hidden", "false");
}

function closeSubmitModal() {
  selectedTaskId = "";
  taskSubmitModal.classList.remove("show");
  taskSubmitModal.setAttribute("aria-hidden", "true");
}

function submitTaskAnswer(event) {
  event.preventDefault();
  if (!selectedTaskId) {
    return;
  }

  const answers = getStoredArray(JAWABAN_STORAGE_KEY);
  const fileName = taskFileInput.files && taskFileInput.files.length > 0 ? taskFileInput.files[0].name : null;

  const payload = {
    id: `ANS-${Date.now()}`,
    taskId: selectedTaskId,
    studentId: STUDENT_PROFILE.id,
    studentName: STUDENT_PROFILE.name,
    answerText: taskAnswerInput.value.trim(),
    fileName,
    submittedAt: new Date().toISOString(),
    status: "submitted",
  };

  const existingIndex = answers.findIndex(
    (item) => item.taskId === selectedTaskId && item.studentId === STUDENT_PROFILE.id,
  );

  if (existingIndex >= 0) {
    answers[existingIndex] = {
      ...answers[existingIndex],
      ...payload,
      id: answers[existingIndex].id,
    };
  } else {
    answers.push(payload);
  }

  saveStoredArray(JAWABAN_STORAGE_KEY, answers);
  closeSubmitModal();
  renderTaskSection();
  alert("Jawaban tugas berhasil dikirim.");
}

function renderGradeChart() {
  if (!(gradeProgressChartCanvas instanceof HTMLCanvasElement) || typeof Chart === "undefined") {
    return;
  }

  const labels = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5"];
  const values = [82, 84, 86, 88, 90];

  new Chart(gradeProgressChartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Nilai Rata-rata",
          data: values,
          borderRadius: 8,
          backgroundColor: ["#2db9dd", "#27b4d8", "#1db0ce", "#1aa8c4", "#149eb9"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#335b7a",
            font: {
              family: "Plus Jakarta Sans",
              weight: "700",
            },
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            color: "#4f6d8a",
          },
          grid: {
            color: "#dce9f7",
          },
        },
        x: {
          ticks: {
            color: "#4f6d8a",
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

function createReportStatusBadge(statusValue) {
  const normalizedStatus = String(statusValue ?? "").toLowerCase();
  if (normalizedStatus === "selesai") {
    return '<span class="badge success">Selesai</span>';
  }

  return '<span class="badge warning">Menunggu Tanggapan</span>';
}

function renderStudentReportHistory() {
  if (!(studentReportHistoryBody instanceof HTMLElement)) {
    return;
  }

  const reports = getStoredArray(LAPORAN_MURID_STORAGE_KEY)
    .filter((report) => report.studentId === STUDENT_PROFILE.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (reports.length === 0) {
    studentReportHistoryBody.innerHTML = `
      <tr>
        <td colspan="4">Belum ada laporan yang Anda kirim.</td>
      </tr>
    `;
    return;
  }

  studentReportHistoryBody.innerHTML = reports
    .map(
      (report) => `
        <tr>
          <td>${toDisplayDate(report.createdAt)}</td>
          <td>${report.category}</td>
          <td>${report.teacherName}</td>
          <td>${createReportStatusBadge(report.status)}</td>
        </tr>
      `,
    )
    .join("");
}

function handleStudentReportSubmit(event) {
  event.preventDefault();
  if (!(studentReportForm instanceof HTMLFormElement)) {
    return;
  }

  const formData = new FormData(studentReportForm);
  const category = String(formData.get("reportCategory") ?? "").trim();
  const teacherName = String(formData.get("reportTeacherName") ?? "").trim();
  const reportContent = String(formData.get("reportDescription") ?? "").trim();

  if (!category || !teacherName || !reportContent) {
    return;
  }

  const reports = getStoredArray(LAPORAN_MURID_STORAGE_KEY);
  reports.push({
    id: `LPR-${Date.now()}`,
    studentId: STUDENT_PROFILE.id,
    studentName: STUDENT_PROFILE.name,
    className: STUDENT_PROFILE.className,
    category,
    teacherName,
    reportContent,
    status: "Menunggu Tanggapan",
    createdAt: new Date().toISOString(),
  });

  saveStoredArray(LAPORAN_MURID_STORAGE_KEY, reports);
  studentReportForm.reset();
  renderStudentReportHistory();
}

updateClock();
setInterval(updateClock, 1000);
registerSidebarNavigation();
registerJoinButtons();
renderGradeChart();
renderAnnouncementBoard();
renderAttendanceWidget();
renderBillingSection();
renderTaskSection();
renderStudentReportHistory();

studentTaskList?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const submitBtn = target.closest(".js-open-submit");
  if (!(submitBtn instanceof HTMLButtonElement)) {
    return;
  }

  const taskId = submitBtn.dataset.taskId;
  const taskTitle = submitBtn.dataset.taskTitle;
  if (!taskId || !taskTitle) {
    return;
  }

  openSubmitModal(taskId, taskTitle);
});

taskSubmitForm?.addEventListener("submit", submitTaskAnswer);
studentReportForm?.addEventListener("submit", handleStudentReportSubmit);
cancelTaskSubmitBtn?.addEventListener("click", closeSubmitModal);
taskSubmitModal?.addEventListener("click", (event) => {
  if (event.target === taskSubmitModal) {
    closeSubmitModal();
  }
});
