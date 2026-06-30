const RAPOT_FORMULA_KEY = "goldenity.rapotFormula";
const STUDENT_ROSTER_KEY = "goldenity.studentRoster";
const MEETING_SCHEDULE_KEY = "goldenity.virtualClassSchedules";

const rapotFormulaForm = document.querySelector("#rapotFormulaForm");
const taskWeightInput = document.querySelector("#taskWeight");
const utsWeightInput = document.querySelector("#utsWeight");
const uasWeightInput = document.querySelector("#uasWeight");
const formulaPreview = document.querySelector("#formulaPreview");

const massPromotionBtn = document.querySelector("#massPromotionBtn");
const promotionTableBody = document.querySelector("#promotionTableBody");

const generateMeetingBtn = document.querySelector("#generateMeetingBtn");
const meetingTableBody = document.querySelector("#meetingTableBody");

const defaultFormula = {
  tugas: 30,
  uts: 30,
  uas: 40,
};

const defaultStudents = [
  { id: "STD-001", nis: "24001", name: "Alya Ramadhani", classLevel: "Kelas X" },
  { id: "STD-002", nis: "24002", name: "Fadli Maulana", classLevel: "Kelas X" },
  { id: "STD-003", nis: "24003", name: "Nadia Saputri", classLevel: "Kelas XI" },
  { id: "STD-004", nis: "24004", name: "Riko Pratama", classLevel: "Kelas XI" },
  { id: "STD-005", nis: "24005", name: "Salsabila Putri", classLevel: "Kelas XII" },
  { id: "STD-006", nis: "24006", name: "Kevin Aditama", classLevel: "Kelas XII" },
];

const defaultSchedules = [
  { id: "MAT-X1", className: "Kelas X IPA 1", subject: "Matematika", schedule: "Senin, 08:00" },
  { id: "BIO-X1", className: "Kelas X IPA 1", subject: "Biologi", schedule: "Selasa, 10:00" },
  { id: "FIS-XI2", className: "Kelas XI IPA 2", subject: "Fisika", schedule: "Rabu, 09:30" },
  { id: "EKO-XII1", className: "Kelas XII IPS 1", subject: "Ekonomi", schedule: "Kamis, 11:00" },
];

function safeParse(rawValue, fallbackValue) {
  try {
    const parsed = JSON.parse(rawValue);
    return parsed ?? fallbackValue;
  } catch (_error) {
    return fallbackValue;
  }
}

function getRapotFormula() {
  const saved = localStorage.getItem(RAPOT_FORMULA_KEY);
  if (!saved) {
    localStorage.setItem(RAPOT_FORMULA_KEY, JSON.stringify(defaultFormula));
    return { ...defaultFormula };
  }
  const parsed = safeParse(saved, { ...defaultFormula });
  return {
    tugas: Number(parsed.tugas ?? defaultFormula.tugas),
    uts: Number(parsed.uts ?? defaultFormula.uts),
    uas: Number(parsed.uas ?? defaultFormula.uas),
  };
}

function saveRapotFormula(formula) {
  localStorage.setItem(RAPOT_FORMULA_KEY, JSON.stringify(formula));
}

function getStudentRoster() {
  const saved = localStorage.getItem(STUDENT_ROSTER_KEY);
  if (!saved) {
    localStorage.setItem(STUDENT_ROSTER_KEY, JSON.stringify(defaultStudents));
    return [...defaultStudents];
  }

  const parsed = safeParse(saved, [...defaultStudents]);
  return Array.isArray(parsed) ? parsed : [...defaultStudents];
}

function saveStudentRoster(students) {
  localStorage.setItem(STUDENT_ROSTER_KEY, JSON.stringify(students));
}

function getMeetingSchedules() {
  const saved = localStorage.getItem(MEETING_SCHEDULE_KEY);
  if (!saved) {
    localStorage.setItem(MEETING_SCHEDULE_KEY, JSON.stringify(defaultSchedules));
    return [...defaultSchedules];
  }

  const parsed = safeParse(saved, [...defaultSchedules]);
  return Array.isArray(parsed) ? parsed : [...defaultSchedules];
}

function saveMeetingSchedules(schedules) {
  localStorage.setItem(MEETING_SCHEDULE_KEY, JSON.stringify(schedules));
}

function renderFormulaPreview() {
  const formula = getRapotFormula();
  taskWeightInput.value = String(formula.tugas);
  utsWeightInput.value = String(formula.uts);
  uasWeightInput.value = String(formula.uas);
  formulaPreview.textContent = `Formula aktif: Nilai Akhir = (${formula.tugas}% x Tugas) + (${formula.uts}% x UTS) + (${formula.uas}% x UAS)`;
}

function getPromotionStatus(classLevel) {
  return classLevel.includes("XII") ? "Lulus" : "Naik Kelas";
}

function renderPromotionTable() {
  const students = getStudentRoster();

  promotionTableBody.innerHTML = students
    .map((student) => {
      const status = getPromotionStatus(student.classLevel || "");
      const badgeClass = status === "Lulus" ? "pass" : "pending";

      return `
        <tr>
          <td>${student.nis}</td>
          <td>${student.name}</td>
          <td>${student.classLevel || "Kelas X"}</td>
          <td><span class="badge ${badgeClass}">${status}</span></td>
        </tr>
      `;
    })
    .join("");
}

function toNextClassLevel(classLevel) {
  if (classLevel.includes("Kelas X") && !classLevel.includes("Kelas XI")) {
    return classLevel.replace("Kelas X", "Kelas XI");
  }

  if (classLevel.includes("Kelas XI")) {
    return classLevel.replace("Kelas XI", "Kelas XII");
  }

  return classLevel;
}

function processMassPromotion() {
  const students = getStudentRoster();

  const updatedStudents = students.map((student) => {
    const previous = String(student.classLevel || "Kelas X");
    const next = previous.includes("Kelas XII") ? previous : toNextClassLevel(previous);
    return {
      ...student,
      classLevel: next,
      promotedAt: new Date().toISOString(),
    };
  });

  saveStudentRoster(updatedStudents);
  renderPromotionTable();
  alert("Proses kenaikan kelas massal berhasil. Data murid telah diperbarui.");
}

function renderMeetingTable() {
  const schedules = getMeetingSchedules();

  meetingTableBody.innerHTML = schedules
    .map((schedule) => {
      const link = schedule.virtualLink
        ? `<a href="${schedule.virtualLink}" target="_blank" rel="noreferrer">${schedule.virtualLink}</a>`
        : "Belum digenerate";

      return `
        <tr>
          <td>${schedule.id}</td>
          <td>${schedule.className}</td>
          <td>${schedule.subject}</td>
          <td>${schedule.schedule}</td>
          <td>${link}</td>
        </tr>
      `;
    })
    .join("");
}

function createMeetingToken(schedule) {
  const base = `${schedule.id}-${schedule.className}`.toLowerCase().replace(/[^a-z0-9]/g, "");
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${base.slice(0, 8)}${randomPart}`;
}

function autoGenerateMeetingRooms() {
  const schedules = getMeetingSchedules();

  const updatedSchedules = schedules.map((schedule) => {
    const token = createMeetingToken(schedule);
    return {
      ...schedule,
      virtualLink: `https://meet.goldenity.campus/room-${token}`,
      generatedAt: new Date().toISOString(),
    };
  });

  saveMeetingSchedules(updatedSchedules);
  renderMeetingTable();
  alert("Virtual class link unik berhasil dibuat untuk setiap sesi kelas.");
}

rapotFormulaForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const tugas = Number(taskWeightInput.value);
  const uts = Number(utsWeightInput.value);
  const uas = Number(uasWeightInput.value);
  const total = tugas + uts + uas;

  if (total !== 100) {
    alert("Total bobot harus tepat 100%.");
    return;
  }

  const formula = { tugas, uts, uas };
  saveRapotFormula(formula);
  renderFormulaPreview();
  alert("Formulasi rapot berhasil disimpan.");
});

massPromotionBtn.addEventListener("click", processMassPromotion);
generateMeetingBtn.addEventListener("click", autoGenerateMeetingRooms);

getStudentRoster();
renderFormulaPreview();
renderPromotionTable();
renderMeetingTable();
