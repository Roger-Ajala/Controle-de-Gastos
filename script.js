let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let chart;

function salvar() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function render() {
  const lista = document.getElementById("lista");
  const saldoEl = document.getElementById("saldo");
  const filtro = document.getElementById("filtroCategoria").value;
  

  lista.innerHTML = "";

  let total = 0;
  let receitas = 0;
  let despesas = 0;

  transacoes.forEach((t, index) => {
    total += t.valor;
    if (filtro !== "todas" && t.categoria !== filtro) return;
    if (t.valor >= 0) receitas += t.valor;
    else despesas += Math.abs(t.valor);

    const li = document.createElement("li");
    li.classList.add(t.valor >= 0 ? "receita" : "despesa");

    li.innerHTML = `
      <div>
        <strong>${t.desc}</strong><br>
        <small>${t.categoria}</small>
      </div>

      <div>
        R$ ${t.valor}
        <button onclick="remover(${index})">❌</button>
      </div>
    `;

    lista.appendChild(li);
  });

  saldoEl.innerText = `R$ ${total}`;

  atualizarGrafico(receitas, despesas);
}


function atualizarGrafico(receitas, despesas) {
  const ctx = document.getElementById("grafico");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [{
        data: [receitas, despesas]
      }]
    }
  });
}


function add() {
  const desc = document.getElementById("desc").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value;
  

  if (!desc || isNaN(valor)) return;

  transacoes.push({ desc, valor, categoria });

  document.getElementById("desc").value = "";
  document.getElementById("valor").value = "";

  salvar();
  render();
}


function remover(index) {
  transacoes.splice(index, 1);
  salvar();
  render();
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

render();