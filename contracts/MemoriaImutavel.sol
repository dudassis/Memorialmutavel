// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MemoriaImutavel {
    struct Memoria {
        string mensagem;      // texto ou nome do arquivo
        string cid;           // hash (CID)
        uint256 timestamp;    // data e hora
        address autor;        // quem registrou
    }

    Memoria[] public memorias; // lista com todas as memórias

    event MemoriaRegistrada(
        address indexed autor,
        string mensagem,
        string cid,
        uint256 timestamp
    );

    // ✅ Registrar uma nova memória
    function registrarMemoria(string memory _mensagem, string memory _cid) public {
        Memoria memory nova = Memoria({
            mensagem: _mensagem,
            cid: _cid,
            timestamp: block.timestamp,
            autor: msg.sender
        });

        memorias.push(nova);

        emit MemoriaRegistrada(msg.sender, _mensagem, _cid, block.timestamp);
    }

    // ✅ Retorna o número total de memórias registradas
    function getTotalMemorias() public view returns (uint256) {
        return memorias.length;
    }

    // ✅ Retorna todas as memórias de um endereço específico (opcional)
    function getMemoriasPorAutor(address _autor) public view returns (Memoria[] memory) {
        uint256 count = 0;

        // Contar quantas memórias pertencem ao autor
        for (uint256 i = 0; i < memorias.length; i++) {
            if (memorias[i].autor == _autor) {
                count++;
            }
        }

        // Criar array com o tamanho exato
        Memoria[] memory resultado = new Memoria[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < memorias.length; i++) {
            if (memorias[i].autor == _autor) {
                resultado[index] = memorias[i];
                index++;
            }
        }

        return resultado;
    }
}
