import dotenv from "dotenv";
dotenv.config(); 

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

    const cid = Buffer.from(Date.now().toString()).toString("base64");


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
