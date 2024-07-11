import { defineQuery, defineSignal, proxyActivities, setHandler, sleep } from '@temporalio/workflow';
import type * as activities from './activities';

const { getUserWorkflow, andTheWinnerIs } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 minutes',
  retry: {
    backoffCoefficient: 1,
    maximumInterval: '2s',
    nonRetryableErrorTypes: ['not_found']
  },
});

export async function example_01(name: string) {
  return await getUserWorkflow(name);
}

const myAttemptsQuery = defineQuery<unknown, [string]>('my_attempts');
const generalAttemptsQuery = defineQuery('general_attempts');
const tentativaSignal = defineSignal<[string]>('attempt');
const winnerQuery = defineQuery('winner');

export async function example_02() {
  const attempts: { [key: string]: number } = {};
  const winner = {
    email: null,
    attempt_counter: null
  };

  setHandler(tentativaSignal, (attempter: string) => {
    attempts[attempter] = attempts[attempter] ? attempts[attempter] + 1 : 1;
  });

  setHandler(myAttemptsQuery, (tentante) => attempts[tentante] ?? 0);
  setHandler(generalAttemptsQuery, () => attempts);
  setHandler(winnerQuery, () => winner);

  await sleep('5 minutes');
  const AND_THE_WINNER_IS = await andTheWinnerIs(attempts);
  Object.assign(winner, { email: AND_THE_WINNER_IS, attempt_counter: attempts[AND_THE_WINNER_IS] })

  return winner;
}