window.onload = init;

function init() {
    const logoImg = document.getElementById("logo");
    const loginBtn = document.getElementById("login");

    logoImg.onclick = function() {
        window.location.href = "/";
    }

    loginBtn.onclick = function() {
        window.location.href = "/login";
    }
}