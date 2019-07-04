import { getData, mutatedRemove, mutatedRemoveV2 } from '../utils';

console.time('Data Generator');
const data = getData(1e6);
console.timeEnd('Data Generator');

console.time('JS Filter');
const filtered = data.filter(d=> d.value>50);
console.timeEnd('JS Filter');
 
console.time('Filter-MutateV2');
// const delItems = mutatedRemove(data, (item: any)=> item.value>50);
// console.log('Deleted :' + delItems.length + ', Remaining : ' + data.length);
console.timeEnd('Filter-MutateV2');

console.time('Filter-MutateV1');
const delItems1 = mutatedRemoveV2(data, (item: any)=> item.value>50);
console.log('Deleted :' + delItems1.length + ', Remaining : ' + data.length);
console.timeEnd('Filter-MutateV1');
