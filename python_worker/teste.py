import requests
from temporalio import activity

@activity.defn
async def buscar_dados_api(moedaDe, moedaPara):
    try:
        url = f"https://wise.com/rates/history+live?source={moedaDe}&target={moedaPara}&length=1"
        resposta = requests.get(url)
        if resposta.status_code == 200:
            return resposta.json()[0]
        else:
            resposta.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Ocorreu um erro: {e}")
        return None
    
@activity.defn
async def calcular_matematica_avancada(valor, multiplcador):
    return float(valor) * float(multiplcador)