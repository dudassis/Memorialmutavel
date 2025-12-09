/// ===================== CONFIGURAÇÕES =====================
const backendURL = "http://localhost:3000";

let conta;
let contrato;
let provider;

/// ===================== ELEMENTOS DO DOM =====================
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletStatus = document.getElementById("walletStatus");

const sendBtn = document.getElementById("sendBtn");
const fileInput = document.getElementById("fileInput");
const customName = document.getElementById("customName");
const anoFoto = document.getElementById("anoFoto");
const dataFoto = document.getElementById("dataFoto");
const contextoFoto = document.getElementById("contextoFoto");
const progressBar = document.getElementById("progressBar");
const result = document.getElementById("result");

const sendCartaBtn = document.getElementById("sendCartaBtn");
const dataDaCarta = document.getElementById("dataCarta");
const cartaTexto = document.getElementById("cartaTexto");
const diarioTitulo = document.getElementById("diarioTitulo");

/// ===================== FUNÇÃO: CARREGAR CONTRATO =====================
async function carregarContrato() {
  try {
    const addrJson = await fetch("./contract-address.json").then(r => r.json());
    /*const abiJson = await fetch("./Memoria.json").then(r => r.json());*/
    const abiJson = await fetch("./MemoriaImutavel.json").then(r => r.json());


    const signer = provider.getSigner();

    contrato = new ethers.Contract(
      addrJson.address,
      abiJson.abi,
      signer
    );

    console.log("Contrato carregado:", contrato.address);

  } catch (e) {
    console.error("Erro ao carregar contrato:", e);
    alert("Erro ao carregar contrato. Verifique arquivos JSON.");
  }
}

/// ===================== CONECTAR METAMASK =====================
async function conectarMetaMask() {
  if (!window.ethereum) {
    alert("MetaMask não encontrada!");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    conta = await signer.getAddress();

    walletStatus.innerText =
      "✅ Conectado: " + conta.substring(0, 6) + "..." + conta.slice(-4);

    await carregarContrato();

  } catch (err) {
    console.error("Erro ao conectar MetaMask detalhado:", err);
    walletStatus.innerText = "❌ Erro ao conectar";
    alert(`Falha ao conectar MetaMask: ${err.message || err}`);
  }
}

connectWalletBtn.addEventListener("click", conectarMetaMask);

/// ===================== ENVIAR ARQUIVO =====================
sendBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Selecione um arquivo!");
  if (!conta) return alert("Conecte a MetaMask!");

  const nomeFinal = customName.value.trim() || file.name;
  const anoFinal = anoFoto.value || "";
  const dataFinal = dataFoto.value || "";
  const contextoFinal = contextoFoto.value.trim() || "";

  result.innerHTML = "⏳ Preparando envio...";
  progressBar.value = 0;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("nome", nomeFinal);
  formData.append("ano", anoFinal);
  formData.append("data", dataFinal);
  formData.append("contexto", contextoFinal);

  try {
    const response = await fetch(`${backendURL}/upload`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error(`Erro no upload: ${response.status}`);

    const res = await response.json();
    progressBar.value = 100;
    result.innerHTML = `✅ <b>Upload concluído!</b><br>
                        <b>Arquivo:</b> ${res.nome}<br>
                        <b>CID:</b> ${res.cid}`;

    // Registrar no contrato com try/catch separado para capturar erros RPC
    try {
      const tx = await contrato.registrarMemoria(res.nome, res.cid, {
        gasLimit: 1000_000 // define limite de gás para evitar erro RPC
      });
      await tx.wait();
      alert("✅ Arquivo registrado na Polygon!");
    } catch (err) {
      console.error("Erro blockchain detalhado:", err);
      result.innerHTML += `<br>⚠️ Erro ao registrar no contrato: ${err.message || err}`;
      if(err.code === -32603){
        alert("Erro RPC interno. Tente aumentar o gasLimit ou reiniciar a MetaMask.");
      }
    }

  } catch (err) {
    console.error("Erro upload detalhado:", err);
    result.innerText = `⚠️ Falha ao enviar arquivo: ${err.message || err}`;
  }
});

/// ===================== ENVIAR CARTA =====================
sendCartaBtn.addEventListener("click", async () => {
  if (!cartaTexto.value.trim()) return alert("Digite sua carta!");
  if (!conta) return alert("Conecte a MetaMask!");

  const tituloFinal = diarioTitulo.value.trim() || "Carta digital";
  const dataFinal = dataDaCarta.value || "";

  try {
    const response = await fetch(`${backendURL}/carta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: cartaTexto.value.trim(),
        titulo: tituloFinal,
        data: dataFinal
      })
    });

    if (!response.ok) throw new Error(`Erro no servidor: ${response.status}`);
    const res = await response.json();

    try {
      const tx = await contrato.registrarMemoria(tituloFinal, res.cid, {
        gasLimit: 1000_000 // também define limite de gás para cartas
      });
      await tx.wait();
      alert("✅ Carta registrada na blockchain!");
    } catch (err) {
      console.error("Erro blockchain detalhado:", err);
      alert(`⚠️ Falha ao registrar carta: ${err.message || err}`);
      if(err.code === -32603){
        alert("Erro RPC interno ao enviar carta. Tente aumentar o gasLimit ou reiniciar a MetaMask.");
      }
    }

    cartaTexto.value = "";
    diarioTitulo.value = "";
    dataDaCarta.value = "";

  } catch (err) {
    console.error("Erro fetch detalhado:", err);
    alert(`⚠️ Falha ao enviar carta: ${err.message || err}`);
  }
});

/// ===================== LOGOUT =====================
document.getElementById("logoutBtn").addEventListener("click", () => {
  walletStatus.innerText = "Desconectado";
  window.location.href = "login.html";
});
