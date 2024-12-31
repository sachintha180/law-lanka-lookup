import {
  enableLogoClick,
  enableLoginClick,
  showModal,
  enableModalHide,
  getFormJSON,
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

    try {
      // Get the JSON data
      const { success, message, data } = getFormJSON(formData);

      // Throw error if unsuccessful
      if (!success) {
        throw new Error(message);
      }

      // Send data to Flask via POST request
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Parse the response
      const result = await response.json();

      // Redirect to login page if successful
      if (result.success) {
        window.location.href = "/login?registered=true";
      }

      // Otherwise, throw error
      else {
        throw new Error(result.message);
      }
    } catch (error) {
      // Show the error in the message modal
      showModal("message-modal", "Registration Error", error.message, "error");
    }

    // Enable the form button
    formButton.disabled = false;
  };
}

function init() {
  // Enable the logo click
  enableLogoClick();

  // Enable the login button click
  enableLoginClick();

  // Enable registration
  enableRegister();

  // Enable modal hide
  enableModalHide();
}
