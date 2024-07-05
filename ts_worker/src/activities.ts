import { activityInfo } from '@temporalio/activity';
import axios from "axios";
export type Saldo = {
  valor: number;
  tentativa: number;
};
export async function consultarSaldoXXBank(): Promise<Saldo> {
  const tentativa = activityInfo().attempt || 1;
  const { data: resultado } = await axios.get("http://localhost:3000");

  return {
    valor: resultado.value,
    tentativa,
  }
}
