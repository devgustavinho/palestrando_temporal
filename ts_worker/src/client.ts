import { Connection, Client } from '@temporalio/client';
import * as Workflows from './types/workflow-commands';
import { openAccount as openAccountWorkflow } from './workflows';
async function run() {
  const client = new Client({ connection: await Connection.connect() });
  const openAccount: Workflows.OpenAccount = {
    accountId: "1234568",
    address: {
      address1: '123 Temporal Street',
      postalCode: '98006',
    },
    bankDetails: {
      accountNumber: "12345689",
      routingNumber: '1234555',
      accountType: 'Checking',
      personalOwner: {
        firstName: 'Bart',
        lastName: 'Simpson',
      },
    },
    bankId: 'Foo Bar Savings and Loan',
    clientEmail: 'bart@simpson.io',
  };

  await client.workflow.execute(openAccountWorkflow, {
    taskQueue: 'saga-demo',
    workflowId: 'saga-' + openAccount.accountId,
    args: [openAccount],
  });
}

run().catch((err) => {
  console.error('account failed to open', err);
  process.exit(1);
});
