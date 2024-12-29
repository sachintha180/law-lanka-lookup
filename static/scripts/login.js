window.onload = init;

function init() {
  const logoImg = document.getElementById("logo");
  const registerBtn = document.getElementById("register");

  logoImg.onclick = function () {
    window.location.href = "/";
  };

  registerBtn.onclick = function () {
    window.location.href = "/register";
  };
}
