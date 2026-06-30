const digitalClock = document.querySelector("#digitalClock");
const joinButtons = document.querySelectorAll(".js-join-class");
const gradeProgressChartCanvas = document.querySelector("#gradeProgressChart");

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

function registerJoinButtons() {
  joinButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const subject = button.getAttribute("data-subject") || "kelas";
      alert(`Menghubungkan ke Virtual Class untuk ${subject}...`);
    });
  });
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

updateClock();
setInterval(updateClock, 1000);
registerJoinButtons();
renderGradeChart();
