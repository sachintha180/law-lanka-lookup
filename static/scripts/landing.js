import {
  enableLogoClick,
  enableLoginClick,
  enableRegisterClick,
} from "./common.js";

window.onload = init;

function init() {
  // Enable clicking the navigation buttons
  enableLogoClick();
  enableLoginClick();
  enableRegisterClick();
}
