import {
  enableLogoClick,
  enableRegisterClick,
  showModal,
  enableModalHide,
  postJSONAndRedirect,
} from "./common.js";

window.onload = init;

function checkJustRegistered() {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Show the message modal if the URL contains the 'registered' parameter
  if (urlParams.get("registered") === "true") {
    showModal(
      "message-modal",
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

    // Try to log in
    postJSONAndRedirect(formData, form.action, "/dashboard", "Login Error", {
      login: true,
    });

    // Re-enable the form button
    formButton.disabled = false;
  };
}

function init() {
  // Check if the user has just registered
  checkJustRegistered();

  // Enable clicking the navigation buttons
  enableLogoClick();
  enableRegisterClick();

  // Enable logging in
  enableLogin();

  // Enable hiding the message modal
  enableModalHide("message-modal");
}
