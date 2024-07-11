import { activityInfo, ApplicationFailure } from '@temporalio/activity';
import axios from "axios";
export type User = {
  id: number;
  name: string;
};
export async function getUserWorkflow(name: string): Promise<{ user: User, attempt: number}> {
  const attempt = activityInfo().attempt || 1;
  try {
    const { data } = await axios.get(`http://localhost:3000/user?name=${name}`);
    return {
      user: data,
      attempt: attempt,
    };
  } catch (err) {
    const { error, cause } = (err as any).response?.data ?? {}
    throw new ApplicationFailure(cause, error);
  }
}

export async function andTheWinnerIs(attempts: { [key: string]: number }): Promise<string> {
  const attempters = Object.keys(attempts);
  const contactArray: string[] = [];

  for (const attempter of attempters) {
    const attempterArray = new Array<string>(attempts[attempter]).fill(attempter);
    console.log(attempterArray);
    contactArray.push(...attempterArray);
  }
  const randomIndex = getRandom(0, contactArray.length - 1);
  
  console.log(contactArray, randomIndex);
  return contactArray[randomIndex];
}

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}