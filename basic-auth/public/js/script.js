document.addEventListener(
  "DOMContentLoaded",
  () => {
    const cm = document.getElementById("customModal");
    const cmb = document.getElementById("customModalBtn");

    cmb.onclick = function closeModal() {
      window.sessionStorage.setItem("showPopup", false);
      cm.style.visibility = "hidden";
    };

    if (!window) return;

    const showPopup = window.sessionStorage.getItem("showPopup");

    if (showPopup === null) {
      window.sessionStorage.setItem("showPopup", true);
    }

    if (showPopup === "false") {
      cm.style.visibility = "hidden";
    }
  },
  false
);
