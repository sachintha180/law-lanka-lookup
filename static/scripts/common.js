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
  const buttons = modalContainer.querySelectorAll(".button");

  modal.classList.remove("hidden");
  if (type) {
    modalContainer.classList.add(type);
    buttons.forEach((button) => {
      button.classList.add(`${type}-light`);
    });
  }
  if (title) {
    modalTitle.innerText = title;
  }
  if (message) {
    modalMessage.innerText = message;
  }
}

export function enableModalHide(modalId) {
  const modal = document.getElementById(modalId);
  const modalContainer = modal.querySelector(".modal-container");
  const buttons = modalContainer.querySelectorAll(".button");
  const okButton = modalContainer.querySelector(".ok-button");

  okButton.onclick = function () {
    modal.classList.add("hidden");
    modalContainer.classList.remove("danger");
    modalContainer.classList.remove("success");
    buttons.forEach((button) => {
      button.classList.remove("danger-light");
      button.classList.remove("success-light");
    });
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

export async function postJSONAndRedirect(
  formData,
  submissionUrl,
  redirectUrl,
  errorTitle,
  queryParams
) {
  try {
    // Get the JSON data
    const { success, message, data } = getFormJSON(formData);

    // Throw error if unsuccessful
    if (!success) {
      throw new Error(message);
    }

    // Send data to Flask via POST request
    const response = await fetch(submissionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Parse the response
    const result = await response.json();

    // Format query parameters into a string
    let queryParamsString = "";
    for (let key in queryParams) {
      queryParamsString += `&${key}=${queryParams[key]}`;
    }

    // Redirect to the specified URL if successful
    if (result.success) {
      window.location.href = `${redirectUrl}?${queryParamsString.slice(1)}`;
    }

    // Otherwise, throw error
    else {
      throw new Error(result.message);
    }
  } catch (error) {
    // Show the error in the message modal
    showModal("message-modal", errorTitle, error.message, "danger");
  }
}
