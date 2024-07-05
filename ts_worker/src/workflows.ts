import { executeChild, proxyActivities } from '@temporalio/workflow';
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
