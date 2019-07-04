import { getRandom, uniqueNum } from "./random-num";
const uniq = uniqueNum();

export function getData(n: number): any[] {  
    const arrays = [];
    for (let i = 0; i < n; i++) {
      arrays.push({
        id: uniq(),
        name: "NAME" + Math.floor(Math.random() * n),
        value: getRandom(10,100)
      });
    }
    return arrays;
  };