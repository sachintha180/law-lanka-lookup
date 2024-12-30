import {
  enableLogoClick,
  enableLogoutClick,
  enableModalHide,
  showModal,
} from "./common.js";

window.onload = init;

function checkJustLogin() {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Show the modal if the URL contains the 'login' parameter
  if (urlParams.get("login") === "true") {
    showModal(
      "Login Successful",
      "You have successfully logged in. Welcome back!",
      "success"
    );
  }
}

function init() {
  // Check if the user just logged in
  checkJustLogin();

  // Enable the logo click
  enableLogoClick();

  // Enable the logout button click
  enableLogoutClick();

  // Enable modal hide
  enableModalHide();
}
