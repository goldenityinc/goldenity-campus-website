const CLASS_STORAGE_KEY = "goldenity.schoolClasses";
const TEACHER_STORAGE_KEY = "goldenity.schoolTeachers";
const STUDENT_STORAGE_KEY = "goldenity.studentRoster";

const tabKelasBtn = document.querySelector("#tabKelasBtn");
const tabGuruBtn = document.querySelector("#tabGuruBtn");
const tabKelasPanel = document.querySelector("#tabKelasPanel");
const tabGuruPanel = document.querySelector("#tabGuruPanel");

const addClassBtn = document.querySelector("#addClassBtn");
const assignStudentBtn = document.querySelector("#assignStudentBtn");
const addTeacherBtn = document.querySelector("#addTeacherBtn");
const assignTeacherBtn = document.querySelector("#assignTeacherBtn");

const classTableBody = document.querySelector("#classTableBody");
const teacherTableBody = document.querySelector("#teacherTableBody");

const academicModal = document.querySelector("#academicModal");
const academicModalTitle = document.querySelector("#academicModalTitle");
const academicModalSubtitle = document.querySelector("#academicModalSubtitle");
const academicModalForm = document.querySelector("#academicModalForm");
const cancelAcademicModalBtn = document.querySelector("#cancelAcademicModalBtn");

const defaultClasses = [
  {
    id: "X-IPA-1",
    className: "Kelas X IPA 1",
    waliKelas: "Belum Ditentukan",
    studentIds: ["STD-001", "STD-002"],
  },
  {
    id: "X-IPS-1",
    className: "Kelas X IPS 1",
    waliKelas: "Belum Ditentukan",
    studentIds: ["STD-003"],
  },
  {
    id: "XI-IPA-2",
    className: "Kelas XI IPA 2",
    waliKelas: "Belum Ditentukan",
    studentIds: ["STD-004"],
  },
];

const defaultTeachers = [
  {
    id: "T-001",
    nip: "198902120001",
    name: "Rina Prasetyo",
    mainSubject: "Matematika",
    classesHandled: [],
  },
  {
    id: "T-002",
    nip: "198703030002",
    name: "Hendra Wijaya",
    mainSubject: "Fisika",
    classesHandled: [],
  },
  {
    id: "T-003",
    nip: "199001250003",
    name: "Citra Maharani",
    mainSubject: "Bahasa Indonesia",
    classesHandled: [],
  },
];

const defaultStudents = [
  { id: "STD-001", nis: "24001", name: "Alya Ramadhani", classLevel: "Kelas X" },
  { id: "STD-002", nis: "24002", name: "Fadli Maulana", classLevel: "Kelas X" },
  { id: "STD-003", nis: "24003", name: "Nadia Saputri", classLevel: "Kelas X" },
  { id: "STD-004", nis: "24004", name: "Riko Pratama", classLevel: "Kelas XI" },
  { id: "STD-005", nis: "24005", name: "Salsabila Putri", classLevel: "Kelas XI" },
  { id: "STD-006", nis: "24006", name: "Kevin Aditama", classLevel: "Kelas XII" },
];

let modalMode = "";

function safeParseArray(rawValue, fallbackValue) {
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : fallbackValue;
  } catch (_error) {
    return fallbackValue;
  }
}

function getSchoolClasses() {
  const saved = localStorage.getItem(CLASS_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(defaultClasses));
    return [...defaultClasses];
  }
  return safeParseArray(saved, [...defaultClasses]);
}

function saveSchoolClasses(classes) {
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(classes));
}

function getSchoolTeachers() {
  const saved = localStorage.getItem(TEACHER_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(defaultTeachers));
    return [...defaultTeachers];
  }
  return safeParseArray(saved, [...defaultTeachers]);
}

function saveSchoolTeachers(teachers) {
  localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(teachers));
}

function getStudentRoster() {
  const saved = localStorage.getItem(STUDENT_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(defaultStudents));
    return [...defaultStudents];
  }
  return safeParseArray(saved, [...defaultStudents]);
}

function saveStudentRoster(students) {
  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(students));
}

function switchTab(tabName) {
  const isKelas = tabName === "kelas";
  tabKelasBtn.classList.toggle("active", isKelas);
  tabGuruBtn.classList.toggle("active", !isKelas);
  tabKelasPanel.classList.toggle("active", isKelas);
  tabGuruPanel.classList.toggle("active", !isKelas);
  tabKelasBtn.setAttribute("aria-selected", String(isKelas));
  tabGuruBtn.setAttribute("aria-selected", String(!isKelas));
  tabGuruPanel.setAttribute("aria-hidden", String(isKelas));
}

function renderClassTable() {
  const classes = getSchoolClasses();

  classTableBody.innerHTML = classes
    .map((classItem) => {
      const studentCount = Array.isArray(classItem.studentIds) ? classItem.studentIds.length : 0;
      return `
        <tr>
          <td>${classItem.className}</td>
          <td><span class="chip">${classItem.waliKelas || "Belum Ditentukan"}</span></td>
          <td>${studentCount} murid</td>
          <td>
            <div class="action-row">
              <button class="btn btn-danger js-delete-class" type="button" data-class-id="${classItem.id}">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderTeacherTable() {
  const teachers = getSchoolTeachers();

  teacherTableBody.innerHTML = teachers
    .map((teacher) => {
      const classesHandled = Array.isArray(teacher.classesHandled) && teacher.classesHandled.length
        ? teacher.classesHandled.join(", ")
        : "-";

      return `
        <tr>
          <td>${teacher.nip}</td>
          <td>${teacher.name}</td>
          <td>${teacher.mainSubject}</td>
          <td>${classesHandled}</td>
          <td>
            <div class="action-row">
              <button class="btn btn-danger js-delete-teacher" type="button" data-teacher-id="${teacher.id}">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderAll() {
  renderClassTable();
  renderTeacherTable();
}

function openModal(title, subtitle, formHtml, nextMode) {
  modalMode = nextMode;
  academicModalTitle.textContent = title;
  academicModalSubtitle.textContent = subtitle;
  academicModalForm.innerHTML = formHtml;
  academicModal.classList.add("show");
  academicModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modalMode = "";
  academicModal.classList.remove("show");
  academicModal.setAttribute("aria-hidden", "true");
  academicModalForm.innerHTML = "";
}

function openAddClassModal() {
  openModal(
    "Tambah Kelas",
    "Isi detail kelas baru untuk memperbarui daftar kelas.",
    `
      <label style="grid-column: span 2;">
        Nama Kelas
        <input name="className" type="text" placeholder="Contoh: Kelas XI IPA 3" required />
      </label>
    `,
    "add-class",
  );
}

function openAddTeacherModal() {
  openModal(
    "Tambah Guru Baru",
    "Data guru akan tersimpan ke master data guru sekolah.",
    `
      <label>
        NIP
        <input name="nip" type="text" placeholder="Contoh: 198801010001" required />
      </label>
      <label>
        Nama Guru
        <input name="name" type="text" placeholder="Contoh: Andi Setiawan" required />
      </label>
      <label style="grid-column: span 2;">
        Mata Pelajaran Utama
        <input name="mainSubject" type="text" placeholder="Contoh: Biologi" required />
      </label>
    `,
    "add-teacher",
  );
}

function openAssignTeacherModal() {
  const teachers = getSchoolTeachers();
  const classes = getSchoolClasses();

  if (!teachers.length || !classes.length) {
    alert("Pastikan data guru dan kelas sudah tersedia sebelum assign.");
    return;
  }

  openModal(
    "Assign Guru ke Kelas",
    "Pilih guru dan kelas. Data wali kelas dan kelas diampu akan otomatis diperbarui.",
    `
      <label>
        Pilih Guru
        <select name="teacherId" required>
          ${teachers
            .map((teacher) => `<option value="${teacher.id}">${teacher.name} - ${teacher.mainSubject}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        Pilih Kelas
        <select name="classId" required>
          ${classes.map((classItem) => `<option value="${classItem.id}">${classItem.className}</option>`).join("")}
        </select>
      </label>
    `,
    "assign-teacher",
  );
}

function openAssignStudentModal() {
  const classes = getSchoolClasses();
  const students = getStudentRoster();

  if (!classes.length || !students.length) {
    alert("Data murid atau kelas belum tersedia.");
    return;
  }

  openModal(
    "Assign Murid ke Kelas",
    "Pilih murid dari data dummy lalu tetapkan ke kelas yang dituju.",
    `
      <label>
        Pilih Murid
        <select name="studentId" required>
          ${students
            .map((student) => `<option value="${student.id}">${student.nis} - ${student.name}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        Pilih Kelas
        <select name="classId" required>
          ${classes.map((classItem) => `<option value="${classItem.id}">${classItem.className}</option>`).join("")}
        </select>
      </label>
    `,
    "assign-student",
  );
}

function handleAddClass(formData) {
  const className = String(formData.get("className") ?? "").trim();

  if (!className) {
    alert("Nama kelas wajib diisi.");
    return;
  }

  const classes = getSchoolClasses();
  classes.push({
    id: `CLS-${Date.now()}`,
    className,
    waliKelas: "Belum Ditentukan",
    studentIds: [],
  });

  saveSchoolClasses(classes);
  renderClassTable();
  alert("Kelas baru berhasil ditambahkan.");
  closeModal();
}

function handleAddTeacher(formData) {
  const nip = String(formData.get("nip") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const mainSubject = String(formData.get("mainSubject") ?? "").trim();

  if (!nip || !name || !mainSubject) {
    alert("Semua data guru wajib diisi.");
    return;
  }

  const teachers = getSchoolTeachers();
  teachers.push({
    id: `T-${Date.now()}`,
    nip,
    name,
    mainSubject,
    classesHandled: [],
  });

  saveSchoolTeachers(teachers);
  renderTeacherTable();
  alert("Guru baru berhasil ditambahkan.");
  closeModal();
}

function handleAssignTeacher(formData) {
  const teacherId = String(formData.get("teacherId") ?? "");
  const classId = String(formData.get("classId") ?? "");

  const teachers = getSchoolTeachers();
  const classes = getSchoolClasses();

  const teacher = teachers.find((item) => item.id === teacherId);
  const classItem = classes.find((item) => item.id === classId);

  if (!teacher || !classItem) {
    alert("Data guru atau kelas tidak ditemukan.");
    return;
  }

  classItem.waliKelas = teacher.name;

  if (!Array.isArray(teacher.classesHandled)) {
    teacher.classesHandled = [];
  }

  if (!teacher.classesHandled.includes(classItem.className)) {
    teacher.classesHandled.push(classItem.className);
  }

  saveSchoolClasses(classes);
  saveSchoolTeachers(teachers);
  renderAll();
  alert(`Guru ${teacher.name} berhasil ditugaskan ke ${classItem.className}.`);
  closeModal();
}

function handleAssignStudent(formData) {
  const studentId = String(formData.get("studentId") ?? "");
  const classId = String(formData.get("classId") ?? "");

  const classes = getSchoolClasses();
  const students = getStudentRoster();

  const selectedClass = classes.find((item) => item.id === classId);
  const selectedStudent = students.find((item) => item.id === studentId);

  if (!selectedClass || !selectedStudent) {
    alert("Data murid atau kelas tidak ditemukan.");
    return;
  }

  classes.forEach((classItem) => {
    classItem.studentIds = Array.isArray(classItem.studentIds)
      ? classItem.studentIds.filter((id) => id !== studentId)
      : [];
  });

  if (!Array.isArray(selectedClass.studentIds)) {
    selectedClass.studentIds = [];
  }
  if (!selectedClass.studentIds.includes(studentId)) {
    selectedClass.studentIds.push(studentId);
  }

  selectedStudent.classLevel = selectedClass.className;

  saveSchoolClasses(classes);
  saveStudentRoster(students);
  renderClassTable();
  alert(`${selectedStudent.name} berhasil di-assign ke ${selectedClass.className}.`);
  closeModal();
}

function handleModalSubmit(event) {
  event.preventDefault();

  const formData = new FormData(academicModalForm);

  if (modalMode === "add-class") {
    handleAddClass(formData);
    return;
  }

  if (modalMode === "add-teacher") {
    handleAddTeacher(formData);
    return;
  }

  if (modalMode === "assign-teacher") {
    handleAssignTeacher(formData);
    return;
  }

  if (modalMode === "assign-student") {
    handleAssignStudent(formData);
  }
}

tabKelasBtn.addEventListener("click", () => switchTab("kelas"));
tabGuruBtn.addEventListener("click", () => switchTab("guru"));

addClassBtn.addEventListener("click", openAddClassModal);
assignStudentBtn.addEventListener("click", openAssignStudentModal);
addTeacherBtn.addEventListener("click", openAddTeacherModal);
assignTeacherBtn.addEventListener("click", openAssignTeacherModal);

cancelAcademicModalBtn.addEventListener("click", closeModal);
academicModal.addEventListener("click", (event) => {
  if (event.target === academicModal) {
    closeModal();
  }
});
academicModalForm.addEventListener("submit", handleModalSubmit);

classTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const deleteBtn = target.closest(".js-delete-class");
  if (!(deleteBtn instanceof HTMLButtonElement)) {
    return;
  }

  const classId = deleteBtn.dataset.classId;
  if (!classId) {
    return;
  }

  const filtered = getSchoolClasses().filter((classItem) => classItem.id !== classId);
  saveSchoolClasses(filtered);
  renderClassTable();
});

teacherTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const deleteBtn = target.closest(".js-delete-teacher");
  if (!(deleteBtn instanceof HTMLButtonElement)) {
    return;
  }

  const teacherId = deleteBtn.dataset.teacherId;
  if (!teacherId) {
    return;
  }

  const remainingTeachers = getSchoolTeachers().filter((teacher) => teacher.id !== teacherId);
  const deletedTeacher = getSchoolTeachers().find((teacher) => teacher.id === teacherId);
  const classes = getSchoolClasses();

  if (deletedTeacher) {
    classes.forEach((classItem) => {
      if (classItem.waliKelas === deletedTeacher.name) {
        classItem.waliKelas = "Belum Ditentukan";
      }
    });
  }

  saveSchoolTeachers(remainingTeachers);
  saveSchoolClasses(classes);
  renderAll();
});

getStudentRoster();
renderAll();
switchTab("kelas");
