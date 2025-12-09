// ===================== CONFIGURAÇÕES =====================
const contratoEndereco = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const historyTableBody = document.getElementById("historyTableBody");

let provider;
let contrato;

// ===================== INICIALIZAÇÃO =====================
async function init() {
  if (!window.ethereum) {
    alert("MetaMask não encontrada!");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    // 🔥 Carregar ABI EXATA usada no app principal
    const response = await fetch("./MemoriaImutavel.json");
    const contratoJson = await response.json();
    const abi = contratoJson.abi;

    const signer = provider.getSigner();
    contrato = new ethers.Contract(contratoEndereco, abi, signer);

    console.log("Contrato carregado:", contrato.address);

    await carregarHistorico();
  } catch (err) {
    console.error("Erro ao iniciar histórico:", err);
  }
}

// ===================== CARREGAR HISTÓRICO =====================
async function carregarHistorico() {
  try {
    const total = Number(await contrato.getTotalMemorias());

    historyTableBody.innerHTML = "";

    if (total === 0) {
      historyTableBody.innerHTML = `
        <tr><td colspan="4">Nenhuma memória registrada ainda.</td></tr>
      `;
      return;
    }

    // Loop invertido (mais recente primeiro)
    for (let i = total - 1; i >= 0; i--) {
      const memoria = await contrato.memorias(i);

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${memoria.autor}</td>
        <td>${memoria.mensagem}</td>
        <td>
          <a href="https://ipfs.io/ipfs/${memoria.cid}" target="_blank">
            ${memoria.cid.substring(0, 10)}...
          </a>
        </td>
        <td>${new Date(Number(memoria.timestamp) * 1000).toLocaleString()}</td>
      `;

      historyTableBody.appendChild(tr);
    }
  } catch (err) {
    console.error("Erro ao carregar histórico:", err);
  }
}

// Inicializar quando a página abrir
window.addEventListener("load", init);
