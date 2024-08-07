window.onload = init;

function init() {
  const authButtons = document.querySelectorAll("button.auth-button");

  for (const authButton of authButtons) {
    authButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "/search.html";
    });
  }

  const backButton = document.querySelector("div#floating-back");

  backButton.addEventListener("click", function (e) {
    window.location.href = "/home.html";
  });
}
