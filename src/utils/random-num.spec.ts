import { getRandom } from './random-num';

describe('Random number generator test', ()=> {
    it('Test if random numbers are generated correctly', ()=> {
        let isTrue = true;
        for(let i =0;i< 100;i++) {
            const rnd = getRandom(1,100);            
            if(rnd < 1 || rnd>100) {
                console.log('Break');
                isTrue=false;
                break;
            }
        }
        expect(isTrue).toBe(true);
    });
});
