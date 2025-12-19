const app = document.getElementById("app");alert("App.js loaded");


let data = {};
let state = JSON.parse(localStorage.getItem("nestApprovedState")) || {};
state.expanded = state.expanded || {};

function saveState() {
  localStorage.setItem("nestApprovedState", JSON.stringify(state));
}

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    showMenu();
  });

function showMenu() {
  app.innerHTML = "";

  data.menu.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.textContent = item.title;
    div.onclick = () => showChecklist(item.id, item.title);
    app.appendChild(div);
  });
}

function showChecklist(id, title) {
  app.innerHTML = "";

  // Back button
  const back = document.createElement("div");
  back.className = "back-button";
  back.textContent = "← Back";
  back.onclick = showMenu;
  app.appendChild(back);

  // Title
  const heading = document.createElement("h2");
  heading.textContent = title;
  app.appendChild(heading);

  data[id].forEach((item, index) => {
    const key = `${id}-${index}`;

    const box = document.createElement("div");
    box.className = "checklist-item";

    // Expand / collapse on tap
    box.onclick = () => {
      state.expanded[key] = !state.expanded[key];
      saveState();
      showChecklist(id, title);
    };

    // Header row
    const header = document.createElement("div");
    header.className = "checklist-header";

    const label = document.createElement("label");
    label.textContent = item.title;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state[key] || false;

    // Prevent checkbox click from toggling expand
    checkbox.onclick = e => e.stopPropagation();

    checkbox.onchange = () => {
      state[key] = checkbox.checked;
      if (checkbox.checked) state.expanded[key] = false;
      saveState();
      showChecklist(id, title);
    };

    header.appendChild(checkbox);
    header.appendChild(label);
    box.appendChild(header);

    // Expanded content
    if (state.expanded[key]) {
      const details = document.createElement("div");
      details.className = "details";

      details.innerHTML = `
        <div><strong>Why it matters:</strong> ${item.why}</div>
        <div><strong>What to look for:</strong> ${item.look}</div>
        ${item.note ? `<div><strong>Inspector Note:</strong> ${item.note}</div>` : ""}

        <div class="image-row">
          <div class="image good">
            ${item.images?.good ? `<img src="${item.images.good}" alt="Good example">` : "GOOD example"}
          </div>
          <div class="image bad">
            ${item.images?.bad ? `<img src="${item.images.bad}" alt="Bad example">` : "BAD example"}
          </div>
        </div>
      `;

      box.appendChild(details);
    }

    app.appendChild(box);
  });
}
