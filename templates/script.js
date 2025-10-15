// frontend/script.js
const BACKEND_URL = "https://placement-app-5sad.onrender.com"; // replace with your render service URL (no trailing slash)

document.getElementById("predictBtn").addEventListener("click", async () => {
  const cgpa = parseFloat(document.getElementById("cgpa").value);
  const iq = parseFloat(document.getElementById("iq").value);
  const resultBox = document.getElementById("result");

  if (isNaN(cgpa) || isNaN(iq)) {
    resultBox.innerText = "Please enter valid numeric CGPA and IQ.";
    return;
  }

  resultBox.innerText = "Predicting...";

  try {
    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: [cgpa, iq] })
    });

    const data = await response.json();
    if (!response.ok) {
      resultBox.innerText = `Error: ${data.error || JSON.stringify(data)}`;
      return;
    }

    const pred = data.prediction;
    const prob = data.probability ? data.probability[0] : null;
    let txt = pred === 1 ? "Result: Placed ✅" : "Result: Not Placed ❌";
    if (prob) txt += ` | Probabilities: ${JSON.stringify(prob)}`;
    resultBox.innerText = txt;
  } catch (err) {
    console.error(err);
    resultBox.innerText = "Network error. Check console and backend URL.";
  }
});
