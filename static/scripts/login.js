import {
  enableLogoClick,
  enableRegisterClick,
  showModal,
  enableModalHide,
  getFormJSON,
} from "./common.js";

window.onload = init;

function checkJustRegistered() {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Show the modal if the URL contains the 'registered' parameter
  if (urlParams.get("registered") === "true") {
    showModal(
      "Registration Successful",
      "You have successfully registered. Please log in to continue.",
      "success"
    );
  }
}

function enableLogin() {
  const form = document.getElementById("login-form");
  const formButton = document.getElementById("login-button");

  form.onsubmit = async function (event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Disable the form button
    formButton.disabled = true;

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

      // Redirect to dashboard page if successful
      if (result.success) {
        window.location.href = "/dashboard?login=true";
      }

      // Otherwise, throw error
      else {
        throw new Error(result.error);
      }
    } catch (error) {
      // Show the error
      showModal("Login Error", error.message, "error");
    }

    // Enable the form button
    formButton.disabled = false;
  };
}

function init() {
  // Check if the user just registered
  checkJustRegistered();

  // Enable the logo click
  enableLogoClick();

  // Enable the register button click
  enableRegisterClick();

  // Enable login
  enableLogin();

  // Enable modal hide
  enableModalHide();
}
