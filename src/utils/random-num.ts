import { numberLiteralTypeAnnotation } from "@babel/types";

export function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * max + min);
}
export function uniqueNum() {
  const numMap = new Map<number, number>();
  return () => {
    let num: number;
    while (true) {
      num = getRandom(1, 1e6);
      if (!numMap.has(num)) {
        numMap.set(num, num);
        break;
      }
    }
    return num;
  };
}
