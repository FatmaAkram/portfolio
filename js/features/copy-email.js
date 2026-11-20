import { $ } from "../utils.js";

/* "Copy" next to the address, for visitors whose mail opens in a browser tab */
export default function initCopyEmail() {
  var btn = $("#copy");
  if (!btn) return;
  var email = btn.dataset.email,
    label = btn.textContent.trim(),
    timer;

  function fallbackCopy() {
    var t = document.createElement("textarea");
    t.value = email;
    t.setAttribute("readonly", "");
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(t);
    return ok ? Promise.resolve() : Promise.reject();
  }

  function show(text) {
    btn.textContent = text;
    clearTimeout(timer);
    timer = setTimeout(function () {
      btn.textContent = label;
    }, 1800);
  }

  btn.addEventListener("click", function () {
    var copy =
      navigator.clipboard && window.isSecureContext
        ? navigator.clipboard.writeText(email).catch(fallbackCopy)
        : fallbackCopy();
    copy.then(
      function () {
        show("Copied");
      },
      function () {
        show("Copy failed");
      },
    );
  });
}
