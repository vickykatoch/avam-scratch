//#region IMPORTS
import { ReplaySubject, SchedulerLike, Subject, Observable } from "rxjs";
//#endregion

//#region MODULE CONSTANTS/TYPES
export type ItemComparer<T> = (existingItem: T, newItem: T) => boolean;
export type VersionComparer<T> = (prevItem: T, newItem: T) => boolean;
export type RemoveComparer<T> = (item: T) => boolean;
//#endregion

export class ExtendedReplaySubject<T> extends ReplaySubject<T> {
    //#region PRIVATE FIELDS
    private deletedNotifier = new Subject<T[]>();
    private _deleted$ = this.deletedNotifier.asObservable();  
    private events: T[];
    //#endregion
    
    //#region CTOR
    constructor(private itemComparer: ItemComparer<T>,
        private bufferSize: number = Number.POSITIVE_INFINITY,
        private versionComparer?: VersionComparer<T>,
        private preserveChronoOrder: boolean=true,       
        scheduler?: SchedulerLike) {
        super(bufferSize, Number.POSITIVE_INFINITY, scheduler);        
        this.next = this.publish;
        this.events = this["_events"];
    }
    //#endregion

    //#region PUBLIC METHODS
    get deleted$() : Observable<T[]> {
        return this._deleted$;
    }
    private publish(value: T) {       
        const index = this.events.findIndex(evt => this.itemComparer(evt, value));        
        if (index >= 0) {
            this.events.splice(index,1,value);
            super.next(value);
        } else {
            if(this.events.length >= this.bufferSize) {
                const deletedIdx = this.preserveChronoOrder ? 0 : this.events.length-1;
                const deleted = this.events.splice(deletedIdx,1);
                this.deletedNotifier.observers.length && this.deletedNotifier.next(deleted);
            }
            this.preserveChronoOrder && this.events.push(value) || this.events.unshift(value);
            super.next(value);
        }
    }
    public remove(itemOrComparer?: T | RemoveComparer<T>) {
        if(itemOrComparer) {
            if (itemOrComparer instanceof Function) {
                const removedItems = this.events.filter(itemOrComparer);
                if(removedItems.length) {
                    const remainedItems = this.events.filter(i=> !itemOrComparer(i));
                    super['_events'] = remainedItems;
                    this.events = super['_events'];
                    this.deletedNotifier.observers.length && this.deletedNotifier.next(removedItems);
                }                
            } else {
                const removedIdx = this.events.findIndex(i=> i === itemOrComparer);
                if(removedIdx >= 0) {            
                    this.events.splice(removedIdx,1);
                    this.deletedNotifier.observers.length && this.deletedNotifier.next([itemOrComparer]);
                }
            }
        } else {  
            if(this.events.length) {
                this.deletedNotifier.observers.length && this.deletedNotifier.next(this.events);
                this.events.length = 0;
            }
        }
    }    
    //#endregion
}