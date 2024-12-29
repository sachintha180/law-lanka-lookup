window.onload = init;

function init() {
  const logoImg = document.getElementById("logo");
  const logoutBtn = document.getElementById("logout");

  logoImg.onclick = function () {
    window.location.href = "/";
  };

  logoutBtn.onclick = function () {
    window.location.href = "/";
  };
}
