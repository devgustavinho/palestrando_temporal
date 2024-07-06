import express from 'express';
import { temporalClient } from './temporal-client.js';
import { WorkflowIdReusePolicy } from '@temporalio/client';
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
















app.get('/sorteio', async (req, res) => {
    if (!req.query.nome) {
        res.json({
            epa: "Epa, adicione ?nome=MeuNomeAqui para participar do sorteio",
        });
        return;
    }
    const temporal = await temporalClient();
    try {
        await temporal.workflow.signalWithStart('sorteioLivroWorkflow', {
            taskQueue: 'banco',
            workflowId: 'sorteio-livro-valendo2',
            signal: 'tentativa',
            signalArgs: [req.query.nome],
            workflowIdReusePolicy: WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE,
        });
    
        res.json({
            aiSim: "Tentativa registrada",
        })
    } catch {
        try {
            const workflowHandler =  temporal.workflow.getHandle('sorteio-livro-valendo2');
            const vencedor = await workflowHandler.query('vencedor');
            res.json({
                opa: "Workflow de sorteio encerrado!",
                vencedor,
            })
        } catch {
            res.json({ opa: "Workflow de sorteio encerrado!", })
        }
    }
})
app.listen(port, () => {
    console.log(`[APP] Servidor rodando em http://localhost:${port}`);
});
