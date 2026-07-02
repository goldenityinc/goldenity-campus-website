const pickupVehicles = [
  {
    id: "pickup-1",
    label: "Mobil Penjemput 1",
    plate: "D 1092 GC",
    driver: "Pak Deni",
    route: "Rute Barat",
    passengers: [
      {
        id: "S-5A-01",
        name: "Raka Pradana",
        classLabel: "Kelas 5A",
        dropoffAddress: "Jl. Melati No. 12, Bandung",
        guardian: "Ibu Maya",
        delivered: false,
        deliveredAt: null,
      },
      {
        id: "S-4B-03",
        name: "Nisa Rahma",
        classLabel: "Kelas 4B",
        dropoffAddress: "Jl. Cihampelas No. 31, Bandung",
        guardian: "Ibu Ayu",
        delivered: false,
        deliveredAt: null,
      },
      {
        id: "S-6C-02",
        name: "Alvaro Putra",
        classLabel: "Kelas 6C",
        dropoffAddress: "Komplek Cendana Residence Blok A3, Bandung",
        guardian: "Ayah Adi",
        delivered: true,
        deliveredAt: "14.12",
      },
    ],
  },
  {
    id: "pickup-2",
    label: "Mobil Penjemput 2",
    plate: "D 7811 BY",
    driver: "Bu Sari",
    route: "Rute Timur",
    passengers: [
      {
        id: "S-5A-02",
        name: "Naura Salsabila",
        classLabel: "Kelas 5A",
        dropoffAddress: "Komplek Panorama Timur Blok C7, Bandung",
        guardian: "Ibu Dian",
        delivered: false,
        deliveredAt: null,
      },
      {
        id: "S-4B-01",
        name: "Alya Kinasih",
        classLabel: "Kelas 4B",
        dropoffAddress: "Jl. Setiabudi Dalam No. 22, Bandung",
        guardian: "Ibu Tari",
        delivered: false,
        deliveredAt: null,
      },
      {
        id: "S-3D-04",
        name: "Raisa Nurfadilah",
        classLabel: "Kelas 3D",
        dropoffAddress: "Jl. Sukarasa No. 18, Bandung",
        guardian: "Kakek Hasan",
        delivered: true,
        deliveredAt: "14.08",
      },
    ],
  },
];

const vehicleTabs = document.getElementById("vehicleTabs");
const vehicleInfo = document.getElementById("vehicleInfo");
const driverStats = document.getElementById("driverStats");
const activeVehicleBadge = document.getElementById("activeVehicleBadge");
const driverTableBody = document.getElementById("driverTableBody");

let activeVehicleId = pickupVehicles[0].id;

function icon(name, className = "ui-icon") {
  const icons = {
    users:
      '<path d="M8 11a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm8 1a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5ZM3.5 18.5a4.5 4.5 0 0 1 9 0v1h-9v-1Zm10 1v-.5a4 4 0 0 0-1.2-2.85A4.8 4.8 0 0 1 20.5 19v.5h-7Z" fill="currentColor"/>',
    check:
      '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m8.6 12.2 2.2 2.3 4.8-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>',
    pickup:
      '<path d="M5.5 14.5h13M7.5 14.5l1.4-4.8h6.2l1.4 4.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><circle cx="8.2" cy="16.7" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="15.8" cy="16.7" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    route:
      '<path d="M7 4.8h5.8a3.2 3.2 0 1 1 0 6.4H11.6a3.2 3.2 0 1 0 0 6.4H17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/><path d="M17 16.8 19.2 19 17 21.2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>',
    car:
      '<path d="M7 5.8h10l2 5.6v6.8H5V11.4L7 5.8Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/><path d="M6.2 11.4h11.6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/><circle cx="8.2" cy="16.8" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="15.8" cy="16.8" r="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    alert:
      '<path d="M12 4.6 20 18.2H4L12 4.6Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/><path d="M12 9.4v4.4M12 16.5h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/>',
    map:
      '<path d="M12 21s7-5.2 7-11.3A7 7 0 0 0 5 9.7C5 15.8 12 21 12 21Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/><circle cx="12" cy="10" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14.8 6.2h4.4v4.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><path d="M19.2 6.2 14 11.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/>',
  };

  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] ?? icons.alert}</svg>`;
}

function getActiveVehicle() {
  return pickupVehicles.find((vehicle) => vehicle.id === activeVehicleId) ?? pickupVehicles[0];
}

function formatTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}.${mm}`;
}

function buildVehicleTabs() {
  vehicleTabs.innerHTML = pickupVehicles
    .map(
      (vehicle) => `
        <button
          class="vehicle-chip ${vehicle.id === activeVehicleId ? "active" : ""}"
          type="button"
          role="tab"
          aria-selected="${vehicle.id === activeVehicleId}"
          data-vehicle-id="${vehicle.id}"
        >
          ${icon("car", "ui-icon tiny")}${vehicle.label}
        </button>
      `,
    )
    .join("");
}

function renderVehicleInfo(vehicle) {
  activeVehicleBadge.textContent = vehicle.label;
  vehicleInfo.innerHTML = `
    <span class="vehicle-info-line">${icon("car", "ui-icon tiny")}Nomor kendaraan: <strong>${vehicle.plate}</strong></span>
    <span class="vehicle-info-line">${icon("users", "ui-icon tiny")}Sopir: <strong>${vehicle.driver}</strong></span>
    <span class="vehicle-info-line">${icon("route", "ui-icon tiny")}Rute: <strong>${vehicle.route}</strong></span>
  `;
}

function buildStats(vehicle) {
  const total = vehicle.passengers.length;
  const delivered = vehicle.passengers.filter((passenger) => passenger.delivered).length;
  const remaining = total - delivered;

  const stats = [
    { label: "Total penumpang", value: total, iconName: "users", tone: "total" },
    { label: "Dalam mobil", value: remaining, iconName: "pickup", tone: "waiting" },
    { label: "Sudah diantar", value: delivered, iconName: "check", tone: "picked" },
    { label: "Rute aktif", value: vehicle.route, iconName: "route", tone: "delegate" },
  ];

  driverStats.innerHTML = stats
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

function statusBadge(passenger) {
  if (passenger.delivered) {
    return `<span class="teacher-status delivered">${icon("check", "ui-icon tiny")}Sudah diantar</span>`;
  }

  return `<span class="teacher-status onboard">${icon("pickup", "ui-icon tiny")}Dalam mobil</span>`;
}

function renderTable(vehicle) {
  driverTableBody.innerHTML = vehicle.passengers
    .map((passenger) => {
      const disabled = passenger.delivered;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(passenger.dropoffAddress)}`;

      return `
        <tr class="${disabled ? "row-delivered" : ""}">
          <td>
            <div class="student-cell">
              <strong>${passenger.name}</strong>
              <span>${passenger.id}</span>
            </div>
          </td>
          <td>
            <div class="student-cell">
              <strong>${passenger.classLabel}</strong>
              <span>Wali: ${passenger.guardian}</span>
            </div>
          </td>
          <td>
            <div class="pickup-cell">
              <span class="pickup-meta">${passenger.dropoffAddress}</span>
              <span class="pickup-meta">${passenger.deliveredAt ? `Update: ${passenger.deliveredAt}` : "Menunggu pengantaran"}</span>
            </div>
          </td>
          <td>
            <div class="table-action-row">
              <a class="table-action-btn map" href="${mapsUrl}" target="_blank" rel="noreferrer">
                ${icon("map", "ui-icon tiny")}Peta
              </a>
            </div>
          </td>
          <td>
            <div class="verification-cell verification-stack">
              ${statusBadge(passenger)}
              <span>${passenger.delivered ? "Pengantaran selesai dicatat." : "Siap diantar sesuai rute."}</span>
            </div>
          </td>
          <td>
            <div class="table-action-row">
              <button
                class="table-action-btn primary"
                type="button"
                data-action="deliver"
                data-passenger-id="${passenger.id}"
                ${disabled ? "disabled" : ""}
              >
                ${icon("check", "ui-icon tiny")}${disabled ? "Sudah diantar" : "Tandai Diantar"}
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderDashboard() {
  const vehicle = getActiveVehicle();
  buildVehicleTabs();
  renderVehicleInfo(vehicle);
  buildStats(vehicle);
  renderTable(vehicle);
}

vehicleTabs?.addEventListener("click", (event) => {
  const target = event.target.closest("[data-vehicle-id]");
  if (!(target instanceof HTMLElement)) return;
  const nextVehicleId = target.getAttribute("data-vehicle-id");
  if (!nextVehicleId) return;
  activeVehicleId = nextVehicleId;
  renderDashboard();
});

driverTableBody?.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!(target instanceof HTMLElement)) return;

  const action = target.getAttribute("data-action");
  const passengerId = target.getAttribute("data-passenger-id");
  if (!action || !passengerId) return;

  const vehicle = getActiveVehicle();
  const passenger = vehicle.passengers.find((item) => item.id === passengerId);
  if (!passenger) return;

  if (action === "deliver" && !passenger.delivered) {
    passenger.delivered = true;
    passenger.deliveredAt = formatTime();
    renderDashboard();
  }
});

renderDashboard();
