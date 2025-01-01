import {
  enableLogoClick,
  enableLoginClick,
  enableRegisterClick,
  showModal,
  enableModalHide,
} from "./common.js";

window.onload = init;

function checkJustDeleted() {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Show the message modal if the URL contains the 'deleted' parameter
  if (urlParams.get("deleted") === "true") {
    showModal(
      "message-modal",
      "Account Deleted",
      "You have successfully deleted your account.",
      "success"
    );
  }
}

function init() {
  // Check if the account was just deleted
  checkJustDeleted();

  // Enable clicking the navigation buttons
  enableLogoClick();
  enableLoginClick();
  enableRegisterClick();

  // Enable hiding the message modal
  enableModalHide("message-modal");
}
