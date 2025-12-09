// backend/index.js

import dotenv from "dotenv";
dotenv.config(); // ⚡ precisa ser o mais cedo possível

// JWT da Pinata
let PINATA_JWT = process.env.PINATA_JWT;
if (!PINATA_JWT) throw new Error("⚠️ PINATA_JWT não encontrado!");
console.log("PINATA_JWT carregado com sucesso!");

// Node utils
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do Express
const app = express();
const PORT = 3000;

// Pasta de uploads local
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const upload = multer({ dest: uploadDir });

// Arquivo local de banco de dados
const DB_FILE = path.join(__dirname, "memorias.json");
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Função para enviar arquivos para Pinata
async function uploadFileToPinata(filePath, fileName) {
  if (!PINATA_JWT) throw new Error("PINATA_JWT não configurado.");

  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), { filename: fileName });

  const headers = {
    ...form.getHeaders(),
    Authorization: `Bearer ${PINATA_JWT}`,
  };

  const response = await axios.post(url, form, { headers });
  return response.data.IpfsHash; // Retorna CID
}

// ================== Upload de arquivos ==================
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { nome, ano, data, contexto } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Nenhum arquivo enviado" });

    // Envia para Pinata e pega o CID
    const cid = await uploadFileToPinata(file.path, file.originalname);

    const novaMemoria = {
      tipo: "arquivo",
      nome: nome || file.originalname,
      cid,
      ano: ano || "",
      data: data || "",
      contexto: contexto || ""
    };

    const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
    memoriaDB.push(novaMemoria);
    fs.writeFileSync(DB_FILE, JSON.stringify(memoriaDB, null, 2));

    res.json(novaMemoria);
  } catch (err) {
    console.error("Erro no upload:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================== Upload de cartas ==================
app.post("/carta", async (req, res) => {
  try {
    const { texto, titulo, data } = req.body;
    if (!texto) return res.status(400).json({ error: "Carta vazia" });

    const cid = "CID_" + Date.now(); // Pode ser modificado para Pinata também

    let anoCorreto = "";
    let dataFinal = "";
    if (typeof data === "string" && data.includes("-")) {
      anoCorreto = Number(data.split("-")[0]);
      dataFinal = data;
    } else {
      const agora = new Date();
      anoCorreto = agora.getFullYear();
      dataFinal = agora.toISOString().split("T")[0];
    }

    const novaCarta = {
      tipo: "carta",
      nome: titulo || "Carta digital",
      cid,
      texto,
      ano: anoCorreto,
      data: dataFinal,
      contexto: ""
    };

    const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
    memoriaDB.push(novaCarta);
    fs.writeFileSync(DB_FILE, JSON.stringify(memoriaDB, null, 2));

    res.json(novaCarta);
  } catch (err) {
    console.error("Erro ao criar carta:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================== Retornar todas as memórias ==================
app.get("/memorias", (req, res) => {
  const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(memoriaDB);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});



// ================== Retornar todas as memórias ==================
app.get("/memorias", (req, res) => {
  const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(memoriaDB);
});


// ================== Inicia o servidor ==================
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
/*/ ================= IMPORTS =================
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import FormData from "form-data";

// Para usar __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CONFIGURAÇÕES =================
const app = express();
const PORT = 3000;

// Pasta onde os arquivos enviados ficam temporariamente
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const upload = multer({ dest: uploadDir });

// Banco de dados local
const DB_FILE = path.join(__dirname, "memorias.json");
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));


// ======================================================
// ===============  PINATA CONFIG  =======================
// ======================================================
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjZjdlYmQzNC1mN2FmLTQ3ZjQtYWE0Yi0xYTYyZmJjZTgwYmIiLCJlbWFpbCI6ImR1ZGFhc3R1ZHkyMDA0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4OTE1ZTk4YTRkYzZhYjJhY2YxOCIsInNjb3BlZEtleVNlY3JldCI6ImYwODhkMjk2MmE4MzM5ZDg4ZTMxNjBlNTIxMGNhY2Y3NDY0ODBmMzYzZDgwYWI3NWQ1NmJmNzJiMWUxYzNiMDMiLCJleHAiOjE3OTY3MDE4MDd9.H6JIcq1-BcPHI_bPomus-NhQM76ZNRJM37-ZXyauo60"; // <---- coloque seu token JWT aqui!

// Upload de arquivo para Pinata
async function uploadFileToPinata(filePath, originalName) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const formData = new FormData();

  formData.append("file", fs.createReadStream(filePath), originalName);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData
  });

  const data = await response.json();

  if (!data.IpfsHash) {
    console.error("Erro da Pinata:", data);
    throw new Error("Falha ao enviar para Pinata");
  }

  return data.IpfsHash;
}

// Upload de objeto JSON para Pinata
async function uploadJSONToPinata(jsonContent) {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify(jsonContent),
  });

  const data = await response.json();

  if (!data.IpfsHash) {
    console.error("Erro Pinata JSON:", data);
    throw new Error("Falha ao enviar JSON para Pinata");
  }

  return data.IpfsHash;
}


// ======================================================
// ===============  ROTAS DO BACKEND  ====================
// ======================================================

// ================== Upload de arquivo ==================
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { nome, ano, data, contexto } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Nenhum arquivo enviado" });

    const filePath = file.path;

    // Envia o arquivo para Pinata
    const cid = await uploadFileToPinata(filePath, file.originalname);

    const novaMemoria = {
      tipo: "arquivo",
      nome: nome || file.originalname,
      cid,
      ano: ano || "",
      data: data || "",
      contexto: contexto || ""
    };

    const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
    memoriaDB.push(novaMemoria);
    fs.writeFileSync(DB_FILE, JSON.stringify(memoriaDB, null, 2));

    res.json(novaMemoria);

  } catch (err) {
    console.error("Erro no upload:", err);
    res.status(500).json({ error: "Erro ao enviar arquivo para Pinata" });
  }
});


// ================== Upload de carta (JSON) ==================
app.post("/carta", async (req, res) => {
  try {
    const { texto, titulo, data } = req.body;

    if (!texto) return res.status(400).json({ error: "Carta vazia" });

    // Envia o JSON para Pinata
    const cid = await uploadJSONToPinata({ texto, titulo, data });

    // ---------- Corrige ano  ----------
    let anoCorreto = "";
    let dataFinal = "";

    if (typeof data === "string" && data.includes("-")) {
      anoCorreto = Number(data.split("-")[0]);
      dataFinal = data;
    } else {
      const agora = new Date();
      anoCorreto = agora.getFullYear();
      dataFinal = agora.toISOString().split("T")[0];
    }

    const novaCarta = {
      tipo: "carta",
      nome: titulo || "Carta digital",
      cid,
      texto,
      ano: anoCorreto,
      data: dataFinal,
      contexto: ""
    };

    const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
    memoriaDB.push(novaCarta);
    fs.writeFileSync(DB_FILE, JSON.stringify(memoriaDB, null, 2));

    res.json(novaCarta);

  } catch (err) {
    console.error("Erro na carta:", err);
    res.status(500).json({ error: "Erro ao enviar carta para Pinata" });
  }
});


// ================== Retornar todas as memórias ==================
app.get("/memorias", (req, res) => {
  const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(memoriaDB);
});


// ================== Inicia o servidor ==================
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
// backend/index.js
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Necessário para ter __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Pasta de uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const upload = multer({ dest: uploadDir });

// Arquivo de banco de dados local
const DB_FILE = path.join(__dirname, "memorias.json");
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// ================== Upload de arquivo ==================
app.post("/upload", upload.single("file"), (req, res) => {
  const { nome, ano, data, contexto } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "Nenhum arquivo enviado" });

  // Simula CID
  const cid = "CID_" + Date.now();

  const novaMemoria = {
    tipo: "arquivo",
    nome: nome || file.originalname,
    cid,
    ano: ano || "",
    data: data || "",
    contexto: contexto || ""
  };

  const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
  memoriaDB.push(novaMemoria);
  fs.writeFileSync(DB_FILE, JSON.stringify(memoriaDB, null, 2));

  res.json(novaMemoria);
});

app.post("/carta", (req, res) => {
  const { texto, titulo, data } = req.body;

  if (!texto) return res.status(400).json({ error: "Carta vazia" });

  const cid = "CID_" + Date.now();

  // ----------- CORREÇÃO AQUI -------------
  let anoCorreto = "";
  let dataFinal = "";

  if (typeof data === "string" && data.includes("-")) {
    anoCorreto = Number(data.split("-")[0]);
    dataFinal = data;
  } else {
    
    const agora = new Date();
    anoCorreto = agora.getFullYear();
    dataFinal = agora.toISOString().split("T")[0];
  }
  // ----------------------------------------

  const novaCarta = {
    tipo: "carta",
    nome: titulo || "Carta digital",
    cid,
    texto,
    ano: anoCorreto,
    data: dataFinal,
    contexto: ""
  };

  const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
  memoriaDB.push(novaCarta);
  fs.writeFileSync(DB_FILE, JSON.stringify(memoriaDB, null, 2));

  res.json(novaCarta);
});


// ================== Retornar todas as memórias ==================
app.get("/memorias", (req, res) => {
  const memoriaDB = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(memoriaDB);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});*/
