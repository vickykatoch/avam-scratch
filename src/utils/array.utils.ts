
export function mutatedRemove<T>(arr: T[], comparer: (item: T) => boolean) : T[] {   
    const removedItems : T[] = [];  
    for(let i=arr.length-1;i>0;i--) {
        if(comparer(arr[i])) {
            removedItems.push(arr[i]);
            arr.splice(i,1);
        }
    }
    return removedItems;
}

export function mutatedRemoveV2<T>(arr: T[], comparer: (item: T) => boolean) : T[] {   
    console.time('Remained');
    const remained = arr.filter(comparer);   
    console.timeEnd('Remained');
    console.time('Removed');
    const removedItems : T[] = arr.filter(i=> !comparer(i));
    console.timeEnd('Removed');    
    return removedItems;
}