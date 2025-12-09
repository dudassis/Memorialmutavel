const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Fazendo deploy do contrato MemoriaImutavel...");

  // Faz o deploy usando ethers v6
  const Memoria = await hre.ethers.deployContract("MemoriaImutavel");
  await Memoria.waitForDeployment();

  const address = await Memoria.getAddress();

  console.log(`✅ Contrato implantado com sucesso!`);
  console.log(`📄 Endereço do contrato: ${address}`);

  // -------------------------------
  // 🔥 Salvar endereço para o frontend
  // -------------------------------
  const addressJson = {
    address: address,
  };

  fs.writeFileSync(
    "./frontend/contract-address.json",
    JSON.stringify(addressJson, null, 2)
  );

  console.log("📁 contract-address.json criado no frontend!");

  // -------------------------------
  // 🔥 Salvar ABI (artifact)
  // -------------------------------
  const artifact = await hre.artifacts.readArtifact("MemoriaImutavel");

  fs.writeFileSync(
    "./frontend/Memoria.json",
    JSON.stringify(artifact, null, 2)
  );

  console.log("📁 ABI (Memoria.json) criado no frontend!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
/*const hre = require("hardhat");

async function main() {
  console.log("🚀 Fazendo deploy do contrato MemoriaImutavel...");

  // Carrega o contrato compilado com o nome correto
  const MemoriaImutavel = await hre.ethers.deployContract("MemoriaImutavel");

  // Aguarda o deploy ser finalizado
  await MemoriaImutavel.waitForDeployment();

  console.log(`✅ Contrato implantado com sucesso!`);
  console.log(`📄 Endereço do contrato: ${MemoriaImutavel.target}`);
}

// Executa o deploy
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});*/
