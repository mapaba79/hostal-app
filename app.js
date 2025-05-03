// Carregar dados ou iniciar novos
let dados = JSON.parse(localStorage.getItem('dados')) || {
  privados: [
    { nome: "Quarto 1 - 1M + Beliche", status: "livre", hospede: "", entrada: "", saida: "" },
    { nome: "Quarto 2 - 1M + Beliche + 1S", status: "livre", hospede: "", entrada: "", saida: "" },
    { nome: "Quarto 3 - 1M + Beliche", status: "livre", hospede: "", entrada: "", saida: "" },
    { nome: "Quarto 4 - 1M + 1S", status: "livre", hospede: "", entrada: "", saida: "" },
    { nome: "Quarto 6 - 1M", status: "livre", hospede: "", entrada: "", saida: "" },
    { nome: "Quarto 7 - 1M + Beliche (compartilhado)", status: "livre", hospede: "", entrada: "", saida: "" }
  ],
  compartilhado: [
    ...['1s','2s','3s','4s','5s','6s',
        '1m','2m','3m','4m','5m','6m',
        '1i','2i','3i','4i','5i','6i'].map(cama => ({
          cama: `Cama ${cama}`, status: "livre", hospede: "", entrada: "", saida: ""
        }))
  ],
  voluntarios: [
    ...['1s','2s','3s',
        '1m','2m','3m',
        '1i','2i','3i'].map(cama => ({
          cama: `Voluntário ${cama}`, status: "livre", hospede: "", entrada: "", saida: ""
        }))
  ],
  historico: [],
  senha: "hostel123"
};

function salvar() {
  localStorage.setItem('dados', JSON.stringify(dados));
}

function renderTudo() {
  const container = document.getElementById('quartos-container');
  container.innerHTML = "";

  container.innerHTML += `<h2>Quartos Privados</h2>`;
  dados.privados.forEach((quarto, index) => {
    container.innerHTML += montarCard(quarto, index, 'privado');
  });

  container.innerHTML += `<h2>Quarto Compartilhado</h2>`;
  dados.compartilhado.forEach((cama, index) => {
    container.innerHTML += montarCard(cama, index, 'compartilhado');
  });

  container.innerHTML += `<h2>Quarto de Voluntários</h2>`;
  dados.voluntarios.forEach((cama, index) => {
    container.innerHTML += montarCard(cama, index, 'voluntarios');
  });
}

function montarCard(obj, index, tipo) {
  return `
    <div class="quarto ${obj.status}">
      <h3>${obj.nome || obj.cama}</h3>
      <p>Status: ${obj.status.toUpperCase()}</p>
      ${obj.hospede ? `<p>Hóspede: ${obj.hospede}</p>` : ''}
      ${obj.entrada ? `<p>Entrada: ${obj.entrada}</p>` : ''}
      ${obj.saida ? `<p>Saída: ${obj.saida}</p>` : ''}
      <button onclick="reservar('${tipo}', ${index})">Reservar</button>
      <button onclick="checkout('${tipo}', ${index})">Check-out</button>
    </div>
  `;
}

function reservar(tipo, index) {
  const nomeHospede = prompt("Nome do hóspede:");
  if (nomeHospede && nomeHospede.trim() !== "") {
    const hoje = new Date().toLocaleDateString();
    let item = dados[tipo][index];
    if (item.status === "livre") {
      item.status = "ocupado";
      item.hospede = nomeHospede.trim();
      item.entrada = hoje;
      item.saida = "";
      salvar();
      renderTudo();
      alert(`Reserva feita para ${nomeHospede}`);
    } else {
      alert("Esta cama/quarto já está ocupada(o).");
    }
  }
}

function checkout(tipo, index) {
  let item = dados[tipo][index];
  if (item.status === "ocupado") {
    if (confirm(`Confirmar check-out de ${item.hospede}?`)) {
      item.saida = new Date().toLocaleDateString();
      dados.historico.push({
        local: item.nome || item.cama,
        hospede: item.hospede,
        entrada: item.entrada,
        saida: item.saida
      });
      item.status = "livre";
      item.hospede = "";
      item.entrada = "";
      item.saida = "";
      salvar();
      renderTudo();
      alert("Check-out realizado.");
    }
  }
}

function verHistorico() {
  if (dados.historico.length === 0) {
    alert("Nenhum hóspede no histórico.");
    return;
  }
  let mensagem = "Histórico:\n\n";
  dados.historico.forEach(h => {
    mensagem += `Local: ${h.local}\nHóspede: ${h.hospede}\nEntrada: ${h.entrada}\nSaída: ${h.saida}\n\n`;
  });
  alert(mensagem);
}

function buscarHospede() {
  const nome = prompt("Digite o nome do hóspede para buscar:");
  if (!nome) return;

  const quartos = [...dados.privados, ...dados.compartilhado, ...dados.voluntarios];
  const resultados = quartos.filter(q => q.hospede.toLowerCase().includes(nome.toLowerCase()));

  if (resultados.length === 0) {
    alert("Nenhum hóspede encontrado.");
  } else {
    let mensagem = "Hóspedes encontrados:\n\n";
    resultados.forEach(r => {
      mensagem += `${r.nome || r.cama} - Entrada: ${r.entrada}\n`;
    });
    alert(mensagem);
  }
}

function login() {
  let senha = prompt("Digite a senha para acessar o sistema:");
  if (senha === dados.senha) {
    document.getElementById('conteudo').style.display = 'block';
    renderTudo();
  } else {
    alert("Senha incorreta.");
  }
}

// Auto login para testes - retirar depois
// login();
