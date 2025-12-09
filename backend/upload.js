import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const PINATA_JWT = "COLOQUE_AQUI_SEU_JWT";

export async function uploadToIPFS(filepath) {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    const form = new FormData();
    form.append("file", fs.createReadStream(filepath));

    try {
        const response = await axios.post(url, form, {
            maxBodyLength: Infinity,
            headers: {
                "Authorization": `Bearer ${PINATA_JWT}`,
                ...form.getHeaders(),
            },
        });

        console.log("✔️ Upload concluído!");
        console.log("CID:", response.data.IpfsHash);

        return response.data.IpfsHash;

    } catch (error) {
        console.error("❌ Erro ao enviar para IPFS:", error);
        return null;
    }
}
