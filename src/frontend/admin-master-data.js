const openModalBtn = document.querySelector("#openModalBtn");
const modal = document.querySelector("#prodiModal");
const cancelModalBtn = document.querySelector("#cancelModalBtn");
const saveProdiBtn = document.querySelector("#saveProdiBtn");

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

openModalBtn.addEventListener("click", openModal);
cancelModalBtn.addEventListener("click", closeModal);

saveProdiBtn.addEventListener("click", () => {
  closeModal();
  alert("Data prodi baru berhasil disimpan (demo statis).");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
