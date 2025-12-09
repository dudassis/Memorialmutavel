/*const express = require("express");
const app = express();

app.use(express.static(__dirname));

app.listen(8080, () => console.log("Frontend rodando em http://localhost:8080"));*/
const express = require("express");
const path = require("path");

const app = express();
const publicDir = __dirname;

// 1) Redireciona a raiz "/" para login.html
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// 2) Rotas explícitas (opcional, mas úteis)
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(publicDir, "login.html"));
});
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});
app.get("/historico.html", (req, res) => {
  res.sendFile(path.join(publicDir, "historico.html"));
});

// 3) Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(publicDir));

// 4) Iniciar servidor
app.listen(8080, "0.0.0.0", () => {
  console.log("Frontend rodando em http://memoriaimutavel:8080");
});
