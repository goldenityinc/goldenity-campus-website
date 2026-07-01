const teacherClasses = [
  {
    id: "kelas-5a",
    label: "Kelas 5A",
    teacherInfo: "Wali kelas: Ibu Lestari Purnama. Fokus hari ini: 1 siswa delegasi, 1 siswa sudah dijemput.",
    students: [
      {
        id: "S-5A-01",
        name: "Raka Pradana",
        studentAddress: "Jl. Melati No. 12, Bandung",
        parentName: "Maya Pradana",
        parentAddress: "Jl. Melati No. 12, Bandung",
        parentPhone: "0812-8899-1100",
        todayStatus: "Sudah lewat jam pulang, penjemput utama belum tiba di sekolah",
        statusKey: "waiting",
        pickupLabel: "Ibu Maya",
        pickupType: "parent",
        distanceToSchoolMeters: 42,
        verification: "Perlu follow-up guru karena siswa belum dijemput setelah jam pulang",
        verificationKey: "not-needed",
        delegateVerified: false,
        overduePickup: true,
        overdueLabel: "Belum dijemput setelah jam pulang",
        history: [
          "Senin, 24 Juni 2026 - Dijemput Ibu Maya pukul 14.12",
          "Selasa, 25 Juni 2026 - Dijemput Ayah Rian pukul 14.09",
          "Rabu, 26 Juni 2026 - Pulang bersama delegasi Kakek Budi pukul 14.18",
        ],
      },
      {
        id: "S-5A-02",
        name: "Naura Salsabila",
        studentAddress: "Komplek Panorama Timur Blok C7, Bandung",
        parentName: "Dian Salsabila",
        parentAddress: "Komplek Panorama Timur Blok C7, Bandung",
        parentPhone: "0813-7002-1178",
        todayStatus: "Delegasi menunggu verifikasi",
        statusKey: "ready",
        pickupLabel: "Delegasi: Kakek Budi",
        pickupType: "delegate",
        distanceToSchoolMeters: 28,
        delegateRelation: "Kakek",
        delegatePhone: "0812-9988-1133",
        delegateVerified: false,
        verification: "QR code dan wajah belum diverifikasi",
        verificationKey: "pending",
        history: [
          "Senin, 24 Juni 2026 - Dijemput Ibu Dian pukul 14.05",
          "Selasa, 25 Juni 2026 - Dijemput Ibu Dian pukul 14.16",
          "Rabu, 26 Juni 2026 - Dijemput Kakek Budi pukul 14.20",
        ],
      },
      {
        id: "S-5A-03",
        name: "Fikri Ramadhan",
        studentAddress: "Jl. Cempaka Asri No. 4, Bandung",
        parentName: "Rina Ramadhan",
        parentAddress: "Jl. Cempaka Asri No. 4, Bandung",
        parentPhone: "0819-3300-2211",
        todayStatus: "Sudah dijemput",
        statusKey: "picked",
        pickupLabel: "Ayah Fikri",
        pickupType: "parent",
        distanceToSchoolMeters: 0,
        verification: "Penjemputan selesai dikonfirmasi guru",
        verificationKey: "verified",
        delegateVerified: true,
        history: [
          "Senin, 24 Juni 2026 - Dijemput Ayah Fikri pukul 14.11",
          "Selasa, 25 Juni 2026 - Dijemput Ibu Rina pukul 14.13",
          "Rabu, 26 Juni 2026 - Dijemput Ayah Fikri pukul 14.08",
        ],
      },
    ],
  },
  {
    id: "kelas-4b",
    label: "Kelas 4B",
    teacherInfo: "Wali kelas: Pak Arman Wijaya. Fokus hari ini: 1 delegasi siap diverifikasi, 2 siswa menunggu.",
    students: [
      {
        id: "S-4B-01",
        name: "Alya Kinasih",
        studentAddress: "Jl. Setiabudi Dalam No. 22, Bandung",
        parentName: "Tari Kinasih",
        parentAddress: "Jl. Setiabudi Dalam No. 22, Bandung",
        parentPhone: "0821-1003-5500",
        todayStatus: "Menunggu penjemputan",
        statusKey: "waiting",
        pickupLabel: "Ibu Tari",
        pickupType: "parent",
        distanceToSchoolMeters: 47,
        verification: "Tidak perlu verifikasi tambahan",
        verificationKey: "not-needed",
        delegateVerified: false,
        history: [
          "Senin, 24 Juni 2026 - Dijemput Ibu Tari pukul 13.57",
          "Selasa, 25 Juni 2026 - Dijemput Ayah Bimo pukul 14.02",
          "Rabu, 26 Juni 2026 - Dijemput Ibu Tari pukul 14.07",
        ],
      },
      {
        id: "S-4B-02",
        name: "Damar Prakoso",
        studentAddress: "Jl. Sukajadi Barat No. 7, Bandung",
        parentName: "Rudi Prakoso",
        parentAddress: "Jl. Sukajadi Barat No. 7, Bandung",
        parentPhone: "0817-5511-4477",
        todayStatus: "Sudah lewat jam pulang, delegasi sudah terverifikasi tetapi siswa belum ditandai dijemput",
        statusKey: "ready",
        pickupLabel: "Delegasi: Ojek Online Adi",
        pickupType: "delegate",
        distanceToSchoolMeters: 18,
        delegateRelation: "Driver Ojek Online",
        delegatePhone: "0812-4411-3390",
        delegateVerified: true,
        verification: "QR code valid dan wajah cocok, tetapi konfirmasi penjemputan belum dilakukan guru",
        verificationKey: "verified",
        history: [
          "Senin, 24 Juni 2026 - Dijemput Ayah Rudi pukul 14.01",
          "Selasa, 25 Juni 2026 - Dijemput Ibu Nia pukul 14.09",
          "Rabu, 26 Juni 2026 - Dijemput delegasi Adi pukul 14.19",
        ],
      },
      {
        id: "S-4B-03",
        name: "Nisa Rahma",
        studentAddress: "Jl. Cihampelas No. 31, Bandung",
        parentName: "Ayu Rahma",
        parentAddress: "Jl. Cihampelas No. 31, Bandung",
        parentPhone: "0815-8877-6622",
        todayStatus: "Menunggu penjemputan",
        statusKey: "waiting",
        pickupLabel: "Ibu Ayu",
        pickupType: "parent",
        distanceToSchoolMeters: 85,
        verification: "Tidak perlu verifikasi tambahan",
        verificationKey: "not-needed",
        delegateVerified: false,
        history: [
          "Senin, 24 Juni 2026 - Dijemput Ibu Ayu pukul 14.04",
          "Selasa, 25 Juni 2026 - Dijemput Ibu Ayu pukul 14.06",
          "Rabu, 26 Juni 2026 - Dijemput Ayah Joko pukul 14.12",
        ],
      },
    ],
  },
];

const classSelect = document.getElementById("classSelect");
const classTeacherInfo = document.getElementById("classTeacherInfo");
const teacherStats = document.getElementById("teacherStats");
const nearbyPickupList = document.getElementById("nearbyPickupList");
const studentTableBody = document.getElementById("studentTableBody");
const selectedClassBadge = document.getElementById("selectedClassBadge");
const teacherModal = document.getElementById("teacherModal");
const teacherModalKicker = document.getElementById("teacherModalKicker");
const teacherModalTitle = document.getElementById("teacherModalTitle");
const teacherModalBody = document.getElementById("teacherModalBody");
const closeTeacherModal = document.getElementById("closeTeacherModal");

let activeClassId = teacherClasses[0].id;

function icon(name, className = "ui-icon") {
  const icons = {
    users:
      '<path d="M8 11a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm8 1a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5ZM3.5 18.5a4.5 4.5 0 0 1 9 0v1h-9v-1Zm10 1v-.5a4 4 0 0 0-1.2-2.85A4.8 4.8 0 0 1 20.5 19v.5h-7Z" fill="currentColor"/>',
    clock:
      '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.8v4.5l3 1.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>',
    check:
      '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m8.6 12.2 2.2 2.3 4.8-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>',
    shield:
      '<path d="M12 3.8 18 6v4.6c0 3.6-2.4 6.9-6 8.1-3.6-1.2-6-4.5-6-8.1V6l6-2.2Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/><path d="m9.4 11.8 1.8 1.8 3.4-3.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>',
    radar:
      '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 12 17.5 8.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/>',
    user:
      '<circle cx="12" cy="8.2" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 18.5a6.5 6.5 0 0 1 13 0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/>',
    pickup:
      '<path d="M5.5 14.5h13M7.5 14.5l1.4-4.8h6.2l1.4 4.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><circle cx="8.2" cy="16.7" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="15.8" cy="16.7" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    info:
      '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 10.2v5M12 7.8h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/>',
    history:
      '<path d="M5.5 9.5A7 7 0 1 1 8 17.9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/><path d="M5 5.5v4h4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><path d="M12 8.8v3.6l2.4 1.6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/>',
    scan:
      '<path d="M7 4.8H5.2v3M17 4.8h1.8v3M7 19.2H5.2v-3M17 19.2h1.8v-3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/><rect x="8" y="8" width="8" height="8" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    note:
      '<path d="M6 4.8h9.2L18 7.6v11.6H6z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/><path d="M14.8 4.8v3H18M8.5 11h7M8.5 14.2h7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/>',
    alert:
      '<path d="M12 4.6 20 18.2H4L12 4.6Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/><path d="M12 9.4v4.4M12 16.5h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/>',
  };

  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] ?? icons.info}</svg>`;
}

function getActiveClass() {
  return teacherClasses.find((classroom) => classroom.id === activeClassId) ?? teacherClasses[0];
}

function getStudentById(studentId) {
  return getActiveClass().students.find((student) => student.id === studentId);
}

function renderClassOptions() {
  classSelect.innerHTML = teacherClasses
    .map((classroom) => `<option value="${classroom.id}">${classroom.label}</option>`)
    .join("");

  classSelect.value = activeClassId;
}

function buildStats(classroom) {
  const totalStudents = classroom.students.length;
  const waitingCount = classroom.students.filter((student) => student.statusKey === "waiting").length;
  const pickedCount = classroom.students.filter((student) => student.statusKey === "picked").length;
  const delegateCount = classroom.students.filter((student) => student.pickupType === "delegate").length;

  const stats = [
    { label: "Total murid", value: totalStudents, iconName: "users", tone: "total" },
    { label: "Menunggu dijemput", value: waitingCount, iconName: "clock", tone: "waiting" },
    { label: "Sudah dijemput", value: pickedCount, iconName: "check", tone: "picked" },
    { label: "Delegasi hari ini", value: delegateCount, iconName: "shield", tone: "delegate" },
  ];

  teacherStats.innerHTML = stats
    .map(
      (stat) => `
        <article class="teacher-stat-card stat-${stat.tone}">
          <p class="stat-label">${icon(stat.iconName, "ui-icon tiny")}${stat.label}</p>
          <h4>${stat.value}</h4>
        </article>
      `,
    )
    .join("");
}

function buildNearbyPickups(classroom) {
  const nearbyStudents = classroom.students.filter(
    (student) => student.distanceToSchoolMeters > 0 && student.distanceToSchoolMeters <= 50 && student.statusKey !== "picked",
  );

  if (nearbyStudents.length === 0) {
    nearbyPickupList.innerHTML = `
      <article class="nearby-empty-state">
        <strong>Belum ada penjemput yang berada dalam radius 50 meter.</strong>
        <span>Data dummy ini akan terisi otomatis ketika penjemput sudah sangat dekat dengan sekolah.</span>
      </article>
    `;
    return;
  }

  nearbyPickupList.innerHTML = nearbyStudents
    .map((student) => {
      const pickupTypeLabel = student.pickupType === "delegate" ? "Delegasi" : "Orang Tua";
      const pickupTypeClass = student.pickupType === "delegate" ? "delegate" : "parent";

      return `
        <article class="nearby-pickup-card">
          <div class="nearby-pickup-top">
            <div>
              <strong>${icon("user", "ui-icon tiny inline-start")}${student.name}</strong>
              <span>${icon("pickup", "ui-icon tiny inline-start")}Penjemput: ${student.pickupLabel}</span>
            </div>
            <span class="nearby-distance">${icon("radar", "ui-icon tiny")}${student.distanceToSchoolMeters} m</span>
          </div>

          <div class="nearby-pickup-meta">
            <span class="nearby-type ${pickupTypeClass}">${icon(student.pickupType === "delegate" ? "shield" : "user", "ui-icon tiny")}${pickupTypeLabel}</span>
            <span class="nearby-note">${icon("clock", "ui-icon tiny")}${student.todayStatus}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function pickupBadge(student) {
  if (student.pickupType === "delegate") {
    return `
      <span class="delegate-badge">
        ${icon("shield", "ui-icon tiny")}
        ${student.pickupLabel}
      </span>
    `;
  }

  return `<span class="pickup-badge">${icon("user", "ui-icon tiny")}${student.pickupLabel}</span>`;
}

function verificationBadge(student) {
  const label =
    student.verificationKey === "verified"
      ? "Terverifikasi"
      : student.verificationKey === "pending"
        ? "Perlu verifikasi"
        : "Tidak perlu";
  const iconName =
    student.verificationKey === "verified" ? "check" : student.verificationKey === "pending" ? "scan" : "info";

  return `<span class="verification-state ${student.verificationKey}">${icon(iconName, "ui-icon tiny")}${label}</span>`;
}

function getDelegateName(student) {
  return student.pickupLabel.replace(/^Delegasi:\s*/, "").trim();
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

function buildDummyQrDataUri(student) {
  const size = 29;
  const moduleSize = 8;
  const padding = 16;
  const svgSize = padding * 2 + size * moduleSize;
  const seed = Array.from(student.id).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
  const modules = [];

  function isFinderArea(x, y, startX, startY) {
    return x >= startX && x < startX + 7 && y >= startY && y < startY + 7;
  }

  function isReserved(x, y) {
    return (
      isFinderArea(x, y, 0, 0) ||
      isFinderArea(x, y, size - 7, 0) ||
      isFinderArea(x, y, 0, size - 7) ||
      x === 6 ||
      y === 6
    );
  }

  function addModule(x, y, color = "#000") {
    modules.push(
      `<rect x="${padding + x * moduleSize}" y="${padding + y * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${color}" />`,
    );
  }

  function addFinder(startX, startY) {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const isOuter = x === 0 || x === 6 || y === 0 || y === 6;
        const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (isOuter || isInner) {
          addModule(startX + x, startY + y);
        }
      }
    }
  }

  addFinder(0, 0);
  addFinder(size - 7, 0);
  addFinder(0, size - 7);

  for (let i = 8; i < size - 8; i += 1) {
    if (i % 2 === 0) {
      addModule(i, 6);
      addModule(6, i);
    }
  }

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (isReserved(x, y)) {
        continue;
      }

      const patternA = (x * 5 + y * 3 + seed) % 7;
      const patternB = (x * y + seed) % 11;
      const patternC = (x + y + seed) % 5;
      const shouldFill = patternA < 3 || (patternB === 0 && patternC <= 2);

      if (shouldFill) {
        addModule(x, y);
      }
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
      <rect width="${svgSize}" height="${svgSize}" rx="22" fill="#ffffff" />
      ${modules.join("")}
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildDummyQrMarkup(student) {
  return `
    <div class="dummy-qr-card" aria-label="Dummy QR code ${getDelegateName(student)}">
      <img
        class="delegate-qr-image"
        src="${buildDummyQrDataUri(student)}"
        alt="Dummy QR code ${getDelegateName(student)}"
      />
      <div class="dummy-qr-code-label">${student.id}</div>
    </div>
  `;
}

function buildDummyFaceMarkup(student) {
  const delegateName = getDelegateName(student);
  const initials = getInitials(delegateName);

  return `
    <div class="dummy-face-card" aria-label="Dummy wajah penjemput ${delegateName}">
      <div class="dummy-face-avatar">${initials}</div>
      <div class="dummy-face-meta">
        <strong>${delegateName}</strong>
        <span>${student.delegateRelation ?? "Delegasi resmi"}</span>
      </div>
    </div>
  `;
}

function statusBadge(student) {
  if (student.overduePickup && student.statusKey !== "picked") {
    return `<span class="teacher-status overdue">${icon("alert", "ui-icon tiny")}${student.statusKey === "ready" ? "Belum dikonfirmasi" : "Lewat jam pulang"}</span>`;
  }

  const label =
    student.statusKey === "picked"
      ? "Sudah dijemput"
      : student.statusKey === "ready"
        ? "Siap diproses"
        : "Menunggu";
  const iconName =
    student.statusKey === "picked" ? "check" : student.statusKey === "ready" ? "shield" : "clock";

  return `<span class="teacher-status ${student.statusKey}">${icon(iconName, "ui-icon tiny")}${label}</span>`;
}

function renderTable(classroom) {
  studentTableBody.innerHTML = classroom.students
    .map((student) => {
      const canVerify =
        student.pickupType === "delegate" && student.verificationKey !== "verified" && student.statusKey !== "picked";
      const pickupDisabled =
        student.statusKey === "picked" || (student.pickupType === "delegate" && !student.delegateVerified);
      const isOverdue = Boolean(student.overduePickup && student.statusKey !== "picked");

      return `
        <tr class="${isOverdue ? "row-overdue" : ""}">
          <td>
            <div class="student-cell">
              <strong class="${isOverdue ? "student-name-alert" : ""}">
                ${isOverdue ? `${icon("alert", "ui-icon tiny")} ` : ""}${student.name}
              </strong>
              <span>${student.id}</span>
            </div>
          </td>
          <td>
            <div class="student-cell">
              ${statusBadge(student)}
              <span>${student.todayStatus}</span>
            </div>
          </td>
          <td>
            <div class="pickup-cell">
              ${pickupBadge(student)}
              ${
                student.pickupType === "delegate"
                  ? `<span class="pickup-meta">${student.delegateRelation} - ${student.delegatePhone}</span>`
                  : `<span class="pickup-meta">Penjemput utama orang tua terdaftar</span>`
              }
            </div>
          </td>
          <td>
            <div class="verification-cell verification-stack">
              ${verificationBadge(student)}
              <span>${student.verification}</span>
            </div>
          </td>
          <td>
            <div class="table-action-row">
              <button class="table-action-btn" type="button" data-action="detail" data-student-id="${student.id}">
                ${icon("info", "ui-icon tiny")}Detail
              </button>
              <button class="table-action-btn" type="button" data-action="history" data-student-id="${student.id}">
                ${icon("history", "ui-icon tiny")}History
              </button>
              <button
                class="table-action-btn track third-party"
                type="button"
                disabled
                title="Disiapkan untuk integrasi third party"
              >
                ${icon("radar", "ui-icon tiny")}Track GPS
              </button>
              ${
                canVerify
                  ? `
                    <button class="table-action-btn warn" type="button" data-action="verify" data-student-id="${student.id}">
                      ${icon("scan", "ui-icon tiny")}Verifikasi
                    </button>
                  `
                  : ""
              }
              <button
                class="table-action-btn primary"
                type="button"
                data-action="pickup"
                data-student-id="${student.id}"
                ${pickupDisabled ? "disabled" : ""}
              >
                ${icon(student.statusKey === "picked" ? "check" : "pickup", "ui-icon tiny")}${student.statusKey === "picked" ? "Selesai" : "Tandai Dijemput"}
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function openModal({ kicker, title, body }) {
  teacherModalKicker.textContent = kicker;
  teacherModalTitle.textContent = title;
  teacherModalBody.innerHTML = body;
  teacherModal.classList.add("open");
  teacherModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  teacherModal.classList.remove("open");
  teacherModal.setAttribute("aria-hidden", "true");
}

function showDetail(student) {
  openModal({
    kicker: "Detail Murid",
    title: student.name,
    body: `
      <div class="modal-grid">
        <div class="modal-field">
          <strong>Nama murid</strong>
          <span>${student.name}</span>
        </div>
        <div class="modal-field">
          <strong>ID siswa</strong>
          <span>${student.id}</span>
        </div>
        <div class="modal-field">
          <strong>Alamat murid</strong>
          <span>${student.studentAddress}</span>
        </div>
        <div class="modal-field">
          <strong>Nama orang tua</strong>
          <span>${student.parentName}</span>
        </div>
        <div class="modal-field">
          <strong>Alamat orang tua</strong>
          <span>${student.parentAddress}</span>
        </div>
        <div class="modal-field">
          <strong>No. telepon orang tua</strong>
          <span>${student.parentPhone}</span>
        </div>
      </div>
      <div class="modal-card">
        <strong>Status penjemputan hari ini</strong>
        <span>${student.todayStatus}. Penjemput saat ini: ${student.pickupLabel}.</span>
      </div>
    `,
  });
}

function showHistory(student) {
  openModal({
    kicker: "History Penjemputan",
    title: `Riwayat ${student.name}`,
    body: `
      <div class="modal-history-list">
        ${student.history
          .map(
            (item) => `
              <div class="modal-history-item">
                <strong>Riwayat</strong>
                <span>${item}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    `,
  });
}

function showVerification(student) {
  openModal({
    kicker: "Verifikasi Delegasi",
    title: `Validasi Penjemput ${student.name}`,
    body: `
      <div class="verify-grid">
        <div class="modal-verify-card">
          <strong>QR Code Delegasi</strong>
          <span>QR dibawa oleh ${student.pickupLabel}. Guru dapat mencocokkan identitas dan relasi penjemput.</span>
          <div class="verify-photo-card">
            ${buildDummyQrMarkup(student)}
            <div class="verify-photo-caption">
              <strong>Kode verifikasi penjemput</strong>
              <span>Gunakan sebagai dummy visual untuk proses scan QR code delegasi di sekolah.</span>
            </div>
          </div>
        </div>
        <div class="modal-verify-card">
          <strong>Foto Wajah Delegasi</strong>
          <span>
            Profil penjemput terdaftar: ${student.pickupLabel}. Kontak delegasi: ${student.delegatePhone ?? "-"}.
          </span>
          <div class="verify-photo-card">
            ${buildDummyFaceMarkup(student)}
            <div class="verify-photo-caption">
              <strong>${student.pickupLabel}</strong>
              <span>Cocokkan wajah penjemput dengan orang yang datang ke sekolah.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-card">
        <strong>Instruksi guru</strong>
        <span>
          Pastikan QR code valid atau wajah sesuai dengan data yang didaftarkan orang tua sebelum siswa dipulangkan.
        </span>
      </div>
      <div class="modal-actions">
        <button class="action-button" type="button" id="approveDelegateButton" data-student-id="${student.id}">
          Verifikasi Delegasi
        </button>
        <button class="ghost-button" type="button" id="closeFromVerification">Tutup</button>
      </div>
    `,
  });

  const approveDelegateButton = document.getElementById("approveDelegateButton");
  const closeFromVerification = document.getElementById("closeFromVerification");

  approveDelegateButton?.addEventListener("click", () => {
    student.delegateVerified = true;
    student.verification = "QR code valid dan wajah cocok";
    student.verificationKey = "verified";
    student.todayStatus = "Delegasi terverifikasi, siap dijemput";
    student.statusKey = "ready";
    renderDashboard();
    closeModal();
  });

  closeFromVerification?.addEventListener("click", closeModal);
}

function markPickedUp(student) {
  student.statusKey = "picked";
  student.todayStatus = "Sudah dijemput dan dikonfirmasi guru";
  student.verification = "Penjemputan selesai dikonfirmasi guru";
  student.verificationKey = "verified";
  student.overduePickup = false;
  student.history.unshift(`Hari ini - Dijemput ${student.pickupLabel} dan dikonfirmasi guru pukul 14.22`);
  renderDashboard();
}

function renderDashboard() {
  const classroom = getActiveClass();
  classTeacherInfo.textContent = classroom.teacherInfo;
  selectedClassBadge.textContent = classroom.label;
  buildStats(classroom);
  buildNearbyPickups(classroom);
  renderTable(classroom);
}

classSelect?.addEventListener("change", (event) => {
  const nextValue = event.target.value;
  activeClassId = nextValue;
  renderDashboard();
});

studentTableBody?.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const studentId = target.getAttribute("data-student-id");
  const action = target.getAttribute("data-action");
  const student = studentId ? getStudentById(studentId) : null;

  if (!student || !action) return;

  if (action === "detail") {
    showDetail(student);
    return;
  }

  if (action === "history") {
    showHistory(student);
    return;
  }

  if (action === "verify") {
    showVerification(student);
    return;
  }

  if (action === "pickup") {
    markPickedUp(student);
  }
});

closeTeacherModal?.addEventListener("click", closeModal);

teacherModal?.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

renderClassOptions();
renderDashboard();
