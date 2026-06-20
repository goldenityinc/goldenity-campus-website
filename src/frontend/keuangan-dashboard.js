const financeChartEl = document.querySelector("#financeDonutChart");

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

document.querySelectorAll(".js-pay-va").forEach((button) => {
  button.addEventListener("click", () => {
    alert("Pembayaran berhasil diverifikasi!");
  });
});
