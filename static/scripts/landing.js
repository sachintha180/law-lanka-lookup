window.onload = init;

function init() {
  const logoImg = document.getElementById("logo");
  const registerBtn = document.getElementById("register");
  const loginBtn = document.getElementById("login");

  logoImg.onclick = function () {
    window.location.href = "/";
  };

  registerBtn.onclick = function () {
    window.location.href = "/register";
  };

  loginBtn.onclick = function () {
    window.location.href = "/login";
  };
}
