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

export function enableRegisterClick() {
  const registerBtn = document.getElementById("register");
  registerBtn.onclick = function () {
    window.location.href = "/register";
  };
}

export function showModal(title, message, type) {
  const modalContainer = document.getElementById("modal");
  const modalTitle = modalContainer.getElementById("modal-title");
  const modalMessage = modalContainer.getElementById("modal-message");

  modalContainer.classList.remove("hidden");
  modalContainer.classList.add(type);

  modalTitle.innerText = title;
  modalMessage.innerText = message;
}

export function enableModalHide() {
  const modalContainer = document.getElementById("modal");
  const okButton = modalContainer.getElementById("ok");

  okButton.onclick = function () {
    modalContainer.classList.remove("error");
    modalContainer.classList.remove("success");
    modalContainer.classList.add("hidden");
  };
}

export function getFormJSON(formData) {
  const data = {};
  for (let [key, value] of formData.entries()) {
    if (!value) {
      return {
        success: false,
        error: `Please fill in the ${key} field.`,
        data: data,
      };
    }
    data[key] = value;
  }
  return {
    success: true,
    error: null,
    data: data,
  };
}
