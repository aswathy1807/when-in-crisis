// ========== ELEMENT SELECTION ==========

// Problem
const problemInput = document.querySelector(".problem-section textarea");
const saveProblemBtn = document.querySelector(".problem-section button");

// Pros elements
const proInput = document.querySelector(".pros-box input");
const proWeight = document.querySelector(".pros-box select");
const addProBtn = document.querySelector(".pros-box button");
const proList = document.querySelector(".pros-box ul");

// Cons elements
const conInput = document.querySelector(".cons-box input");
const conWeight = document.querySelector(".cons-box select");
const addConBtn = document.querySelector(".cons-box button");
const conList = document.querySelector(".cons-box ul");

// Result elements
const prosTotalText = document.querySelector(".result-section p:nth-of-type(1) span");
const consTotalText = document.querySelector(".result-section p:nth-of-type(2) span");
const decisionText = document.querySelector(".result-section h3");
const resetBtn = document.querySelector(".result-section button");

let pros = [];
let cons = [];
let problem = "";

resetBtn.addEventListener("click", () => {
  if (!confirm("Clear this decision?")) return;

  problem = "";
  pros = [];
  cons = [];

  problemInput.value = "";
  proList.innerHTML = "";
  conList.innerHTML = "";

  prosTotalText.textContent = "0";
  consTotalText.textContent = "0";
decisionText.textContent = "Decision: Add pros and cons to see a suggestion";

  localStorage.removeItem("crisisDecisionData");
});



addProBtn.addEventListener("click", () => {
  const text = proInput.value.trim();
  const weight = Number(proWeight.value);

  if (text === "") return;

  pros.push({ text, weight });
  proInput.value = "";

  renderPros();
updateScores();
saveToStorage();

});

addConBtn.addEventListener("click", () => {
  const text = conInput.value.trim();
  const weight = Number(conWeight.value);

  if (text === "") return;

  cons.push({ text, weight });
  conInput.value = "";

  renderCons();
  updateScores();
  saveToStorage();
});


saveProblemBtn.addEventListener("click", () => {
  problem = problemInput.value.trim();
  saveToStorage();
});


function renderPros() {
  proList.innerHTML = "";
  if (pros.length === 0) {
  const li = document.createElement("li");
  li.textContent = "No pros added yet.";
  li.style.opacity = "0.6";
  proList.appendChild(li);
  return;
}


  pros.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `+ ${item.text} (weight: ${item.weight})`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";

    delBtn.addEventListener("click", () => {
  pros.splice(index, 1);
  renderPros();
  updateScores();
  saveToStorage();
});


    li.appendChild(delBtn);
    proList.appendChild(li);
  });
}


function updateScores() {
  const prosTotal = pros.reduce((sum, item) => sum + item.weight, 0);
  const consTotal = cons.reduce((sum, item) => sum + item.weight, 0);

  prosTotalText.textContent = prosTotal;
  consTotalText.textContent = consTotal;

  makeDecision(prosTotal, consTotal);
}


function renderCons() {
  conList.innerHTML = "";
  if (cons.length === 0) {
  const li = document.createElement("li");
  li.textContent = "No cons added yet.";
  li.style.opacity = "0.6";
  conList.appendChild(li);
  return;
}


  cons.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `- ${item.text} (weight: ${item.weight})`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";

    delBtn.addEventListener("click", () => {
  cons.splice(index, 1);
  renderCons();
  updateScores();
  saveToStorage();
});


    li.appendChild(delBtn);
    conList.appendChild(li);
  });
}


function makeDecision(prosTotal, consTotal) {
  const score = prosTotal - consTotal;

  if (score >= 5) {
    decisionText.textContent = "Decision: ✅ Strong YES";
  } else if (score >= 1) {
    decisionText.textContent = "Decision: 🙂 Leaning YES";
  } else if (score === 0) {
    decisionText.textContent = "Decision: ⚖️ Unclear";
  } else if (score >= -4) {
    decisionText.textContent = "Decision: 😐 Leaning NO";
  } else {
    decisionText.textContent = "Decision: ❌ Strong NO";
  }
}

function saveToStorage() {
  const data = {
    problem,
    pros,
    cons
  };

  localStorage.setItem("crisisDecisionData", JSON.stringify(data));
}

function loadFromStorage() {
  const saved = localStorage.getItem("crisisDecisionData");
  if (!saved) return;

  const data = JSON.parse(saved);

  problem = data.problem || "";
  pros = data.pros || [];
  cons = data.cons || [];

  problemInput.value = problem;
  renderPros();
  renderCons();
  updateScores();
}

loadFromStorage();
