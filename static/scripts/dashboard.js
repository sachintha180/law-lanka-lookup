window.onload = init;

function init() {
  const logoImg = document.getElementById("logo");

  logoImg.onclick = function () {
    window.location.href = "/";
  };
}
