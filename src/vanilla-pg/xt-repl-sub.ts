import { ExtendedReplaySubject } from '../rx-xtn';
import { getData, getRandom } from '../utils';
let pubTime: number;
let pubItemId: number;
let delTime: number;
let delId: number;
const data = getData(10000);

const replaySub = new ExtendedReplaySubject((item1: any,item2: any) => {
    return item1.id === item2.id;
}, 10);

replaySub.subscribe(item=> {
    if(!pubItemId) {
        console.error('Item not published but received');
    } else {
        console.log(`Recived : ${pubItemId}, Time : ${(Date.now()-pubTime)/1000}secs`);
        pubItemId=0;
        pubTime=0;
    }
});
replaySub.deleted$.subscribe(items=> {
    console.log('Deleted items ', items.length);
    items.forEach(i=> i.published=false);
});

// insert data
setInterval(()=> {
    const items = data.filter(i=> !i.published)
    const item = items[getRandom(0,items.length-1)];
    item.published=true;
    pubTime = Date.now();
    pubItemId=item.id;
    replaySub.next(item);    
}, 1000);

// delete data
setInterval(()=> {
    const items = data.filter(i=> i.published)
    const item = items[getRandom(0,items.length-1)];    
    
    delId=item.id;
    replaySub.remove((item: any)=> {
        return item.id === item.id;
    });
},5000);