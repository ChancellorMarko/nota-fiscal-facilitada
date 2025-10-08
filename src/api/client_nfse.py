import requests


class ClienteNFSe:
    def __init__(self, base_url: str ="http://localhost:8000"):
        self.base_url = base_url

    def emitir_nota(self, tomador: str, valor: float, servico: str):
        response = requests.post(
            f"{self.base_url}/notas-fiscais",
            params={"tomador": tomador, "valor": valor, "servico": servico},
        )
        return response.json()

    def listar_notas(self):
        response = requests.get(f"{self.base_url}/notas-fiscais")
        return response.json()


# Exemplo de uso
#if __name__ == "__main__":
#    cliente = ClienteNFSe()
#
#    # Emitir nota fiscal
#    nova_nota = cliente.emitir_nota(
#        tomador="Cliente Exemplo", valor=999.99, servico="Desenvolvimento Software"
#    )
#    print("Nota emitida:", nova_nota)
#
#    # Listar todas
#    todas_notas = cliente.listar_notas()
#    print("Todas as notas:", todas_notas)
