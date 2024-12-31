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

export function enableLogoutClick() {
  const logoutBtn = document.getElementById("logout");
  logoutBtn.onclick = function () {
    window.location.href = "/logout";
  };
}

export function enableRegisterClick() {
  const registerBtn = document.getElementById("register");
  registerBtn.onclick = function () {
    window.location.href = "/register";
  };
}

export function showModal(modalId, title, message, type) {
  const modal = document.getElementById(modalId);
  const modalContainer = modal.querySelector(".modal-container");
  const modalTitle = modalContainer.querySelector(".modal-title");
  const modalMessage = modalContainer.querySelector(".modal-message");

  modal.classList.remove("hidden");
  modalContainer.classList.add(type);

  modalTitle.innerText = title;
  modalMessage.innerText = message;
}

export function enableModalHide(modalId) {
  const modal = document.getElementById(modalId);
  const modalContainer = modal.querySelector(".modal-container");
  const okButton = modalContainer.querySelector(".ok-button");

  okButton.onclick = function () {
    modal.classList.add("hidden");
    modalContainer.classList.remove("error");
    modalContainer.classList.remove("success");
  };
}

export function getFormJSON(formData) {
  const data = {};
  for (let [key, value] of formData.entries()) {
    if (!value) {
      return {
        success: false,
        message: `Please fill in the ${key} field.`,
        data: data,
      };
    }
    data[key] = value;
  }
  return {
    success: true,
    message: null,
    data: data,
  };
}
