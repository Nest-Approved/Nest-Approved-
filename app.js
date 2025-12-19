 const app = document.getElementById("app");
let data = {};
let state = JSON.parse(localStorage.getItem("nestApprovedState")) || {};
state.expanded = state.expanded || {};

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    showMenu();
  });

function saveState() {
  localStorage.setItem("nestApprovedState", JSON.stringify(state));
}

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
box.onclick = () => {
  state.expanded[key] = !state.expanded[key];
  saveState();
  showChecklist(id, title);
};

function showChecklist(id, title) {
  app.innerHTML = "";

  const back = document.createElement("div");
  back.className = "back";
  back.textContent = "← Back";
  back.onclick = showMenu;
  app.appendChild(back);

  const header = document.createElement("h3");
  header.textContent = title;
  app.appendChild(header);

  // INFO PAGES (no checkboxes)
  if (id === "about" || id === "howto") {
    const list = data.checklists[id] || [];
    list.forEach(item => {
      const block = document.createElement("div");
      block.className = "info-block";
      block.innerHTML = `
        <p><strong>${item.title}</strong></p>
        <p>${item.why}</p>
        <p>${item.look}</p>
        ${item.note ? `<p><em>${item.note}</em></p>` : ""}
      `;
      app.appendChild(block);
    });
    return;
  }

  // CHECKLIST PAGES
  const list = data.checklists[id] || [];
  list.forEach((item, index) => {
    const key = `${id}-${index}`;
    if (!state[key]) state[key] = false;

    const box = document.createElement("div");
    box.className = "checklist-item";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state[key];
checkbox.onclick = (e) => e.stopPropagation();

    checkbox.onchange = () => {
      state[key] = checkbox.checked;
      saveState();
    };
if (checkbox.checked) state.expanded[key] = false;

    label.appendChild(checkbox);
    label.append(item.title);
    box.appendChild(label);

    const details = document.createElement("div");
    details.className = "details";
    details.innerHTML = `
  <div><strong>Why it matters:</strong> ${item.why}</div>
      <div><strong>What to look for:</strong> ${item.look}</div>
      ${item.note ? `<div><strong>Inspector Note:</strong> ${item.note}</div>` : ""}    
    `;

    box.onclick = () => {
      details.style.display =
        details.style.display === "block" ? "none" : "block";
    };

    box.appendChild(details);
    app.appendChild(box);
  });
}
