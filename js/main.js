(function () {
  const profiles = {
    leo: {
      chip: "Leo’s profile",
      mood: "avoid",
      reading: "Checking against Leo’s dairy allergy…",
      verdict: "Skip this — it has milk.",
      reason: "Because of his dairy allergy",
      chips: ["Milk", "Yoghurt culture"],
      status: "You’re shopping for Leo. Dairy is a hard stop.",
      flags: ["milk"],
    },
    maja: {
      chip: "Maja’s profile",
      mood: "heads",
      reading: "Checking histamine sources and cultures…",
      verdict: "Heads-up — yoghurt cultures sit here.",
      reason: "Because of her histamine intolerance",
      chips: ["Yoghurt culture", "Lactic cultures"],
      status: "You’re shopping for Maja. The allergen box never mentioned this.",
      flags: ["histo"],
    },
    erik: {
      chip: "Erik’s profile",
      mood: "good",
      reading: "Checking against Erik’s nut allergy…",
      verdict: "You’re good — nothing here for you.",
      reason: "",
      chips: [],
      status: "You’re shopping for Erik. Nuts aren’t in this pot.",
      flags: [],
    },
  };

  const device = document.getElementById("hero-device");
  const chip = document.getElementById("hero-chip");
  const verdict = document.getElementById("hero-verdict");
  const reason = document.getElementById("hero-reason");
  const chips = document.getElementById("hero-chips");
  const status = document.getElementById("demo-status");
  const list = document.getElementById("ing-list");
  const toggle = document.getElementById("sheet-toggle");
  const sheet = document.getElementById("hero-sheet");
  const tabs = document.querySelectorAll(".person");
  const year = document.getElementById("year");
  const header = document.querySelector(".site-header");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let typeTimer;
  let readTimer;

  if (year) year.textContent = String(new Date().getFullYear());

  window.addEventListener("scroll", function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  function typeText(el, text, done) {
    window.clearInterval(typeTimer);
    if (!el) return done && done();
    if (reduce || !text) {
      el.textContent = text;
      return done && done();
    }
    el.textContent = "";
    let i = 0;
    typeTimer = window.setInterval(function () {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        window.clearInterval(typeTimer);
        if (done) done();
      }
    }, 22);
  }

  function applyFlags(flags) {
    if (!list) return;
    list.querySelectorAll("li").forEach(function (row) {
      const rowFlags = (row.getAttribute("data-flag") || "").split(" ");
      const hit = flags.some(function (f) { return rowFlags.indexOf(f) !== -1; });
      const dot = row.querySelector(".dot");
      if (!dot) return;
      dot.classList.remove("solid", "hollow", "mute");
      if (hit && rowFlags.indexOf("milk") !== -1 && flags.indexOf("milk") !== -1) {
        dot.classList.add("solid");
      } else if (hit) {
        dot.classList.add("hollow");
      } else {
        dot.classList.add("mute");
      }
    });
  }

  function showChips(items) {
    if (!chips) return;
    chips.innerHTML = "";
    items.forEach(function (label, index) {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = label;
      span.style.animationDelay = reduce ? "0s" : index * 90 + "ms";
      chips.appendChild(span);
    });
  }

  function render(key, animate) {
    const profile = profiles[key];
    if (!profile || !device) return;

    window.clearTimeout(readTimer);
    window.clearInterval(typeTimer);

    chip.textContent = profile.chip;
    status.textContent = profile.status;
    applyFlags(profile.flags);

    if (!animate) {
      device.setAttribute("data-mood", profile.mood);
      verdict.textContent = profile.verdict;
      reason.textContent = profile.reason;
      showChips(profile.chips);
      return;
    }

    device.setAttribute("data-mood", "neutral");
    reason.textContent = "";
    chips.innerHTML = "";
    verdict.textContent = profile.reading;

    readTimer = window.setTimeout(function () {
      device.setAttribute("data-mood", profile.mood);
      typeText(verdict, profile.verdict, function () {
        reason.textContent = profile.reason;
        showChips(profile.chips);
      });
    }, reduce ? 0 : 700);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const key = tab.getAttribute("data-profile");
      tabs.forEach(function (other) {
        const on = other === tab;
        other.classList.toggle("is-active", on);
        other.setAttribute("aria-selected", on ? "true" : "false");
      });
      render(key, true);
    });
  });

  if (toggle && list && sheet) {
    toggle.addEventListener("click", function () {
      const open = list.hasAttribute("hidden");
      if (open) list.removeAttribute("hidden");
      else list.setAttribute("hidden", "");
      sheet.classList.toggle("is-open", open);
      toggle.textContent = open ? "Hide ingredients" : "Tap to see all 4 ingredients";
    });
  }

  render("leo", false);
})();
