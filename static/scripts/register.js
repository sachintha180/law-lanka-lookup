import {
  enableLogoClick,
  enableLoginClick,
  enableModalHide,
  postJSONAndRedirect,
} from "./common.js";

window.onload = init;

function enableRegister() {
  const form = document.getElementById("register-form");
  const formButton = document.getElementById("register-button");

  form.onsubmit = async function (event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Disable the form button
    formButton.disabled = true;

    // Get the form data
    const formData = new FormData(form);

    // Try to register
    postJSONAndRedirect(formData, form.action, "/login", "Registration Error", {
      registered: true,
    });

    // Re-enable the form button
    formButton.disabled = false;
  };
}

function init() {
  // Enable clicking navigation buttons
  enableLogoClick();
  enableLoginClick();

  // Enable registration
  enableRegister();

  // Enable hiding the message modal
  enableModalHide("message-modal");
}
