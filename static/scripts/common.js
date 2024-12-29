export function enableLogoClick() {
  const logoImg = document.getElementById("logo");
  logoImg.onclick = function () {
    window.location.href = "/";
  };
}

export function enableLoginClick() {
  const loginBtn = document.getElementById("login");
  loginBtn.onclick = function () {
    window.location.href = "/login";
  };
}

export function showError(title, message) {
  const errorContainer = document.getElementById("error");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");

  errorContainer.classList.remove("hidden");
  errorTitle.innerText = title;
  errorMessage.innerText = message;
}

export function enableErrorHide() {
  const errorContainer = document.getElementById("error");
  const okButton = document.getElementById("ok-error");

  okButton.onclick = function () {
    errorContainer.classList.add("hidden");
  };
}
