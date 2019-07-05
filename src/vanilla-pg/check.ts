import { ExtendedReplaySubject } from "../rx-xtn";
import { getRandom, getData } from "../utils";

const replaySub = new ExtendedReplaySubject((item1: any, item2: any) => {
  return item1.id === item2.id;
}, 10);

const data = getData(5);
data.forEach(d => replaySub.next(d));

replaySub.subscribe(d => {
  console.log("Data Received : ", d);
});

console.log("DELETED");
replaySub.remove((d: any) => {
  return d.id === data[2].id;
});
replaySub.subscribe(d => {
  console.log("Data Received : ", d);
});
