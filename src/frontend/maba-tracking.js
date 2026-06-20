const colPending = document.querySelector("#colPending");
const colApproved = document.querySelector("#colApproved");

const generatedNim = new Set();

function createRandomNim() {
  let nim = "";

  while (!nim || generatedNim.has(nim)) {
    const suffix = String(Math.floor(Math.random() * 90 + 10));
    nim = `26100${suffix}`;
  }

  generatedNim.add(nim);
  return nim;
}

function approveCard(card) {
  const approveBtn = card.querySelector(".js-approve");
  if (approveBtn) {
    approveBtn.remove();
  }

  const nimBadge = document.createElement("span");
  nimBadge.className = "nim-pill";
  nimBadge.textContent = `NIM: ${createRandomNim()}`;

  card.appendChild(nimBadge);
  colApproved.appendChild(card);
}

colPending.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const approveBtn = target.closest(".js-approve");
  if (!approveBtn) {
    return;
  }

  const card = approveBtn.closest(".maba-card");
  if (!card) {
    return;
  }

  approveCard(card);
});
