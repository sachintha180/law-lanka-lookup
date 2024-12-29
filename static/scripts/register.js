import {
  enableLogoClick,
  enableLoginClick,
  showModal,
  enableModalHide,
  getFormJSON,
} from "./common.js";

window.onload = init;

function enableRegister() {
  const form = document.getElementById("registration-form");

  form.onsubmit = async function (event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the form data
    const formData = new FormData(form);

    try {
      // Get the JSON data
      const { success, data, error } = getFormJSON(formData);

      // Throw error if unsuccessful
      if (!success) {
        throw new Error(error);
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
        throw new Error(result.error);
      }
    } catch (error) {
      // Show the error
      showModal("Registration Error", error.message, "error");
    }
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
