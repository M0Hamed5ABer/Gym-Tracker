const exercises = {
  "تمارين الدفع": ["دفع ارضي  الجهاز الاحمر", "دفع عالي  الجهاز الاسود", "فراشة", "كتف جانبي", "كتف علوي", "باي علي الجهاز"],
  "تمارين السحب": ["سحب أرضي", "سحب عالي", "بايسبس", "دفع خلفي"],
  "تمارين الرجل": ["سكوات", "لانج", "سمي ديدلفت"],
};

const trackerDiv = document.getElementById("tracker");
const chartCtx = document
  .getElementById("progressChart")
  .getContext("2d");
let progressData = JSON.parse(localStorage.getItem("progressData")) || {};

const chart = new Chart(chartCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "تطور الأوزان خلال الأسابيع" },
    },
  },
});

function updateChart() {
  chart.data.labels = [];
  chart.data.datasets = [];

  for (let ex in progressData) {
    const points = progressData[ex];
    const dates = points.map((p) => p.date);
    const weights = points.map((p) => p.weight);

    chart.data.labels = dates; // لتحديث المحور الزمني حسب التواريخ

    chart.data.datasets.push({
      label: ex,
      data: weights,
      fill: false,
      borderColor:
        "#" + Math.floor(Math.random() * 16777215).toString(16),
      tension: 0.3,
    });
  }

  chart.update();
}

function createExerciseSection() {
  for (let group in exercises) {
    const section = document.createElement("div");
    section.className = "section";
    section.innerHTML = `<h2>${group}</h2>`;
    exercises[group].forEach((exercise) => {
      const container = document.createElement("div");
      container.className = "exercise";
      container.innerHTML = `
      <p>${exercise}</p>
      <div class="controls">
        <button onclick="adjustWeight('${exercise}', -2.5)">⬇</button>
        <input id="${exercise}-weight" type="number" value="${getLastWeight(
        exercise
      )}" readonly>
        <button onclick="adjustWeight('${exercise}', 2.5)">⬆</button>
      </div>
    `;
      section.appendChild(container);
    });
    trackerDiv.appendChild(section);
  }
}

function getLastWeight(ex) {
  return progressData[ex]?.slice(-1)[0]?.weight || 0;
}

function adjustWeight(ex, delta) {
  const input = document.getElementById(`${ex}-weight`);
  let newWeight = parseFloat(input.value) + delta;
  newWeight = Math.max(0, newWeight); // لا وزن سلبي

  const today = new Date().toLocaleDateString("ar-EG");
  if (!progressData[ex]) progressData[ex] = [];
  progressData[ex].push({ weight: newWeight, date: today });

  localStorage.setItem("progressData", JSON.stringify(progressData));
  input.value = newWeight;
  updateChart();
}

document.getElementById("clearChart").addEventListener("click", () => {
  if (confirm("هل أنت متأكد من مسح البيانات؟")) {
    localStorage.removeItem("progressData");
    progressData = {};
    updateChart();
    document
      .querySelectorAll('input[type="number"]')
      .forEach((inp) => (inp.value = 0));
  }
});

createExerciseSection();
updateChart();