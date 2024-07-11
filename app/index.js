import express from 'express';
import { temporalClient } from './temporal-client.js';
import { WorkflowIdReusePolicy } from '@temporalio/client';
const app = express();
const port = 3001;
const TS_WORKER = "typescript_worker";
app.get('/user', async (req, res) => {
    if (!req.query.name) {
        res.json({
            epa: "Epa, adicione um name na query",
        });
        return;
    }
    const temporal = await temporalClient();
    try {
        const user = await temporal.workflow.execute('example_01', {
            taskQueue: TS_WORKER,
            args: [req.query.name],
            workflowId: 'example-01-' + Date.now(),
        });

        res.json({ user });
    } catch (err) {
        res.send(err);
    }
});

app.get('/sorteio', async (req, res) => {
    if (!req.query.email) {
        res.json({
            epa: "Epa, adicione ?email=meu.email@fortics.com.br para participar do sorteio",
        });
        return;
    }
    const temporal = await temporalClient();
    try {
        await temporal.workflow.signalWithStart('example_02', {
            taskQueue: TS_WORKER,
            workflowId: 'sorteio-livro',
            signal: 'attempt',
            signalArgs: [req.query.email],
            // workflowIdReusePolicy: WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE
        });
    
        res.json({
            aiSim: "Tentativa registrada",
        })
    } catch {
        try {
            const workflowHandler =  temporal.workflow.getHandle('sorteio-livro');
            const vencedor = await workflowHandler.query('winner');
            res.json({
                opa: "Workflow de sorteio encerrado!",
                vencedor,
            })
        } catch {
            res.json({ opa: "Workflow de sorteio encerrado!", })
        }
    }
})

app.get('/eu_tentei', async (req, res) => {
    if (!req.query.email) {
        res.json({
            epa: "Epa, adicione ?email=meu.email@fortics.com.br para saber suas tentativas",
        });
        return;
    }
    const temporal = await temporalClient();
    try {
        const workflowHandler =  temporal.workflow.getHandle('sorteio-livro');
        const quantity = await workflowHandler.query('my_attempts', req.query.email);
        res.json({
            quantity: quantity ?? 0,
        })
    } catch {
        res.json({ opa: "Nem teve ainda", })
    }
    
})
app.listen(port, () => {
    console.log(`[APP] Servidor rodando em http://localhost:${port}`);
});
