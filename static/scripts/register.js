import {
  enableLogoClick,
  enableLoginClick,
  showError,
  enableErrorHide,
} from "./common.js";

window.onload = init;

function getFormJSON(formData) {
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

      // Check if response is successful
      if (!response.ok) {
        throw new Error("Error in form submission, please try again later.");
      }

      // Parse the response
      const result = await response.json();

      // Check if successful
      if (result.success) {
        window.location.href = "/login";
      }

      // Otherwise, throw error
      else {
        throw new Error(result.error);
      }
    } catch (error) {
      // Show the error
      showError("Registration Error", error.message);
    }
  };
}

function init() {
  // Enable logo and login button click
  enableLogoClick();
  enableLoginClick();

  // Enable registration
  enableRegister();

  // Enable error hide
  enableErrorHide();
}
