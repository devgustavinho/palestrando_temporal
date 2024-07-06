import { condition, defineQuery, defineSignal, executeChild, proxyActivities, setHandler } from '@temporalio/workflow';
import type * as activities from './activities';
enum Moedas  {
  REAL = "BRL", 
  KWANZAS = "AOA",
};

const { consultarSaldoXXBank } = proxyActivities<typeof activities>({
  startToCloseTimeout: '60s',
  retry: {
    backoffCoefficient: 1,
    maximumInterval: '2s',
  }
});

const { buscar_dados_api, calcular_matematica_avancada } = proxyActivities({
  startToCloseTimeout: '60s',
  retry: {
    backoffCoefficient: 1,
    maximumInterval: '2s',
  },
  taskQueue: "matematico"
});

export async function saldoAtualDaEmpresa(): Promise<activities.Saldo> {
  return await consultarSaldoXXBank();
}

export async function valorEmReaisViaAPI(): Promise<number> {
  const { valor } = await executeChild(saldoAtualDaEmpresa, {
    workflowId: "saldo-da-empresa-via-api-" + Date.now()
  });
  const bolsaValoresKwanzas = await buscar_dados_api(Moedas.KWANZAS, Moedas.REAL);
  const valorEmRais: number = await calcular_matematica_avancada(bolsaValoresKwanzas.value, valor);
  return valorEmRais;
}

/* 



























Workflow secreto
*/
const tentativasGeraisQuery = defineQuery('tentativas_gerais');
const tentativaSignal = defineSignal<[string]>('tentativa');
const vencedorQuery = defineQuery('vencedor');
export async function sorteioLivroWorkflow() {
  const tentativas: { [key: string]: number } = {};
  const numeroCorreto = aleatorio(1, 1000);
  const vencedor = {
    nome: null,
    tentativa: null,
    tipoDeVitoria: "sorteio final"
  };

  setHandler(tentativaSignal, (tentante: string) => {
    tentativas[tentante] = tentativas[tentante] ? tentativas[tentante] + 1 : 1;
    const numeroDaTentativa = aleatorio(1, 1000);
    if (!vencedor.nome && numeroDaTentativa == numeroCorreto) {
      Object.assign(vencedor, { nome: tentante, tentativa: tentativas[tentante], tipoDeVitoria: "pura sorte" })
    }
  })
  setHandler(tentativasGeraisQuery, () => tentativas);
  setHandler(vencedorQuery, () => vencedor);

  const condicaoAtingida = await condition(() => !!vencedor?.nome, '5 minutes');

  if(!condicaoAtingida) {
    const vencedorIndex = aleatorio(0, Object.keys(tentativas).length - 1);
    const tentante = Object.keys(tentativas)[vencedorIndex];
    Object.assign(vencedor, { nome: tentante, tentativa: tentativas[tentante] });
  } else {
    console.log(`Número ${numeroCorreto} encontrado`);
  }

  return vencedor;
}

function aleatorio(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}