const gatewayLoginForm = document.querySelector("#gatewayLoginForm");
const usernameInput = document.querySelector("#usernameInput");

if (gatewayLoginForm instanceof HTMLFormElement && usernameInput instanceof HTMLInputElement) {
  gatewayLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim().toLowerCase();

    if (username === "guru") {
      window.location.href = "./admin-management-akademik.html";
      return;
    }

    if (username === "murid") {
      window.location.href = "./student-portal.html";
      return;
    }

    window.alert("Username tidak ditemukan. Coba 'guru' atau 'murid'.");
  });
}
