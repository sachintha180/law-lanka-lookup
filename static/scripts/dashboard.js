import {
  enableLogoClick,
  enableLogoutClick,
  enableModalHide,
  postJSONAndRedirect,
  showModal,
} from "./common.js";

window.onload = init;

function checkJustLogin() {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Show the message modal if the URL contains the 'login' parameter
  if (urlParams.get("login") === "true") {
    showModal(
      "message-modal",
      "Login Successful",
      "You have successfully logged in. Welcome back!",
      "success"
    );
  }
}

function checkJustUpdate() {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Show the message modal if the URL contains the 'updated' parameter
  if (urlParams.get("updated") === "true") {
    showModal(
      "message-modal",
      "Update Successful",
      "You have successfully updated your profile.",
      "success"
    );
  }
}

function enableEditProfile() {
  const form = document.getElementById("edit-profile-form");
  const formButton = document.getElementById("edit-profile-button");

  form.onsubmit = async function (event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Disable the form button
    formButton.disabled = true;

    // Get the form data
    const formData = new FormData(form);

    // Try to update the profile
    postJSONAndRedirect(formData, form.action, "/dashboard", "Update Error", {
      updated: true,
    });

    // Re-enable the form button
    formButton.disabled = false;
  };
}

function init() {
  // Check if user just logged in
  checkJustLogin();

  // Check if user just updated profile
  checkJustUpdate();

  // Enable clicking navigation buttons
  enableLogoClick();
  enableLogoutClick();

  // Enable editing the profile
  enableEditProfile();

  // Enable hiding the message modal
  enableModalHide("message-modal");

  // Enable showing and hiding the edit profile modal
  const modalId = "edit-profile-modal";
  const editProfileActivateButton = document.getElementById(
    "edit-profile-activate-button"
  );
  editProfileActivateButton.onclick = function () {
    showModal(modalId);
  };
  enableModalHide(modalId);
}
