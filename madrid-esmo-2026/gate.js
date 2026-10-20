(function () {
  var KEY = "madrid-esmo-2026-gate";
  var HASH = "362c98033a8d3832f77e990941d5115d42cfbd485cdb67281b3619f926b36c60";

  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  function unlock() {
    try { localStorage.setItem(KEY, "ok"); } catch (e) {}
    document.documentElement.removeAttribute("data-locked");
    var g = document.getElementById("gate");
    if (g) g.remove();
  }

  if (!document.documentElement.hasAttribute("data-locked")) return;

  function mount() {
    if (document.getElementById("gate")) return;
    var style = document.createElement("style");
    style.textContent = [
      "#gate{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:#efe6d6;color:#1c1712;font-family:\"PingFang SC\",\"Hiragino Sans GB\",\"Microsoft YaHei\",\"Noto Sans SC\",\"Segoe UI\",sans-serif}",
      "html[data-theme=dark] #gate{background:#14110e;color:#f6efe6}",
      "#gate form{width:min(100%,22rem);margin:0}",
      "#gate h1{font-family:Palatino,\"Palatino Linotype\",\"Songti SC\",\"STSong\",serif;font-size:1.7rem;line-height:1.2;margin:0 0 0.8rem}",
      "#gate label{display:block;font-weight:700;margin-bottom:0.4rem}",
      "#gate input{width:100%;box-sizing:border-box;font:inherit;font-size:16px;min-height:44px;padding:0.5rem 0.75rem;border-radius:12px;border:1px solid #e3d5c2;background:#fffaf3;color:#1c1712}",
      "html[data-theme=dark] #gate input{border-color:#3a322a;background:#221c17;color:#f6efe6}",
      "#gate button{margin-top:0.75rem;min-height:44px;width:100%;border:0;border-radius:999px;background:#9a3412;color:#fffaf3;font:inherit;font-weight:700}",
      "html[data-theme=dark] #gate button{background:#e7b089;color:#2a140e}",
      "#gate [data-err]{color:#9a3412;font-weight:700;min-height:1.4em;margin:0.6rem 0 0}"
    ].join("");
    document.head.appendChild(style);
    var gate = document.createElement("div");
    gate.id = "gate";
    gate.innerHTML = "<form><h1>马德里 ESMO</h1><label for=\"gate-pass\">密码</label><input id=\"gate-pass\" type=\"password\" autocomplete=\"current-password\" enterkeyhint=\"go\"><p data-err hidden>密码不对</p><button type=\"submit\">打开</button></form>";
    document.body.appendChild(gate);
    var input = gate.querySelector("input");
    var err = gate.querySelector("[data-err]");
    gate.querySelector("form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      err.hidden = true;
      crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.value)).then(function (buf) {
        if (hex(buf) === HASH) unlock();
        else {
          err.hidden = false;
          input.select();
        }
      });
    });
    input.focus();
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
