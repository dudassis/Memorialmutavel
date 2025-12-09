  **Memória Imutável – Registro Permanente na Blockchain**

*(Português)*

O **Memória Imutável** é um site desenvolvido para registrar e preservar lembranças, cartas e mensagens de forma **imutável**, utilizando:

* **Blockchain Polygon Amoy Testnet**
* **Armazenamento descentralizado via IPFS (Pinata)**
* **Contrato inteligente próprio**

Cada registro gera um **CID real**, comprovando a existência permanente do conteúdo. O CID é gravado na blockchain, garantindo segurança, transparência e impossibilidade de alteração.

---

#  **Estrutura do Projeto**

```
memoria_imutavel/
│
├── backend/
│   ├── index.js            → Servidor Express real utilizado
│   ├── .env                → Chave JWT da Pinata
│
├── contract/
│   ├── MemoriaImutavel.sol → Contrato inteligente utilizado no projeto
│
├── frontend/
│   ├── app.js              → Conexão com MetaMask + blockchain
│   ├── index.html          → Página principal do projeto
│   ├── style.css           → Estilos
│
└── README.md
```

---

#  **Fluxo da Aplicação**

### **1️⃣ Usuário cria uma memória**

Ele fornece:

* Título
* Texto
* Data

---

### **2️⃣ Backend envia para o IPFS**

O backend:

* Recebe os dados
* Monta o arquivo JSON
* Envia para a Pinata
* Recebe um **CID**

---

### **3️⃣ O CID é salvo na blockchain**

Via MetaMask, o frontend chama o contrato:

```
registrarCarta(titulo, data, cid)
```

O contrato grava:

* Título
* Data
* CID

---

### **4️⃣ A memória torna-se permanente**

* Conteúdo armazenado no **IPFS**
* CID registrado na **Polygon Amoy**

---

# ⚙️ **Rodando o Backend**

```
cd backend
npm install
```

Criar `.env`:

```
PINATA_JWT=SEU_JWT_AQUI
```

Executar:

```
node index.js
```

Disponível em:
**[http://localhost:3000](http://localhost:3000)**

---

#  **Rodando o Frontend**

```
cd frontend
node server.js
```

Acessar no navegador:

**[http://localhost:8080/login.html](http://localhost:8080/login.html)**

---

# 🔧 **Funcionalidades**

### ✔ Registrar memória

* Envia memória para IPFS
* Recebe CID
* Registra no contrato

---

#  **Consulta de Memórias**

O histórico exibe:

* **Título**
* **Data**
* **CID**

Somente dados presentes no contrato são exibidos — **não** mostra autor, texto ou timestamp.

---

#  **Como acessar memórias no IPFS**

Basta abrir o CID pelo gateway:

```
https://gateway.pinata.cloud/ipfs/<CID>
```

Exemplo:

```
https://gateway.pinata.cloud/ipfs/QmABC123XYZ
```

---

# 🧠 **Contrato Inteligente – MemoriaImutavel.sol**

O contrato armazena:

* Título
* Data
* CID

E disponibiliza as funções de leitura.

---

# ✔ **Conclusão**

O projeto combina:

* Blockchain
* IPFS
* Web3 + Web2
* Interação via MetaMask

criando um sistema totalmente imutável e descentralizado.

---

---

#  **Immutable Memory – Permanent Blockchain Record System**

*(English)*

**Immutable Memory** is a web application designed to permanently store letters and personal messages using:

* **Polygon Amoy Testnet Blockchain**
* **Decentralized IPFS storage (Pinata)**
* **A custom Solidity smart contract**

Each submission generates a **real CID**, stored permanently on IPFS, while the blockchain preserves a tamper-proof proof of existence.

---

#  **Project Structure**

```
memoria_imutavel/
│
├── backend/
│   ├── index.js            → Express server used in the project
│   ├── .env                → Pinata JWT key
│
├── contract/
│   ├── MemoriaImutavel.sol → Smart contract used by the project
│
├── frontend/
│   ├── app.js              → MetaMask + blockchain integration
│   ├── index.html          → Main page of the application
│   ├── style.css           → Stylesheet
│
└── README.md
```

---

#  **System Workflow**

### **1️⃣ User creates a memory**

User provides:

* Title
* Text
* Date

---

### **2️⃣ Backend uploads to IPFS**

The backend:

* Builds a JSON file
* Uploads it to Pinata
* Receives a **CID**

---

### **3️⃣ CID is written to the blockchain**

Via MetaMask, the frontend calls:

```
registrarCarta(title, date, cid)
```

The contract stores:

* Title
* Date
* CID

---

### **4️⃣ Memory becomes permanent**

* Content stored on **IPFS**
* CID stored on **Polygon Amoy**

---

#  **Running the Backend**

```
cd backend
npm install
```

Create `.env`:

```
PINATA_JWT=YOUR_JWT_HERE
```

Run:

```
node index.js
```

Backend available at:
**[http://localhost:3000](http://localhost:3000)**

---

#  **Running the Frontend**

```
cd frontend
node server.js
```

Open in the browser:

**[http://localhost:8080/login.html](http://localhost:8080/login.html)**

---

#  **Features**

### ✔ Register Memory

* Upload to IPFS
* Receive CID
* Store CID on-chain

---

#  **Viewing Saved Memories**

The history displays:

* **Title**
* **Date**
* **CID**

Only on-chain stored information is shown — no author or timestamp.

---

#  **Accessing files on IPFS**

Open with:

```
https://gateway.pinata.cloud/ipfs/<CID>
```

Example:

```
https://gateway.pinata.cloud/ipfs/QmABC123XYZ
```

---

#  **Smart Contract – MemoriaImutavel.sol**

Stores:

* Title
* Date
* CID

And exposes read functions for retrieving saved memories.

---

#  **Conclusion**

The system demonstrates the integration of:

* Blockchain
* IPFS
* Web development
* MetaMask interaction

to create a permanent, decentralized and tamper-proof memory archive.

