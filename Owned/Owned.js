document.getElementById("logout").addEventListener("click", logout);

function logout() {
    localStorage.removeItem("user");
    window.location.href = "../HomePage/home.html";
  }