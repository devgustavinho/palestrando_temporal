import express from 'express';
import { temporalClient } from './temporal-client.js';
const app = express();
const port = 3001;

app.get('/kwanzas', async (req, res) => {
    const temporal = await temporalClient();
    const valor = await temporal.workflow.execute('saldoAtualDaEmpresa', {
        taskQueue: 'banco',
        workflowId: 'buscando-saldo-' + Date.now(),
    });

    res.json({ kwanzas: valor });
});

app.get('/kwanzas-matematicas', async (req, res) => {
    const temporal = await temporalClient();
    const valor = await temporal.workflow.execute('valorEmReaisViaAPI', {
        taskQueue: 'banco',
        workflowId: 'saldo-em-reais-' + Date.now(),
    });

    res.json({ reais: `R$ ${valor.toFixed(2)}` });
});

app.listen(port, () => {
    console.log(`[APP] Servidor rodando em http://localhost:${port}`);
});
