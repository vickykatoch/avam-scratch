import { getRandom, uniqueNum } from "./random-num";
const uniq = uniqueNum();

export interface Dummy {
  id: number;
  name: string;
  value: number;
  published?: boolean;
}

export function getData(n: number): Dummy[] {
  const arrays = [];
  for (let i = 0; i < n; i++) {
    arrays.push({
      id: uniq(),
      name: "NAME" + Math.floor(Math.random() * n),
      value: getRandom(10, 100)
    });
  }
  return arrays;
}
