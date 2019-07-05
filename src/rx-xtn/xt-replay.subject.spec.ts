import { ExtendedReplaySubject } from "./xt-replay.subject";
import { Dummy, getRandom, getData } from "../utils";

const comparer = (a: Dummy, b: Dummy): boolean => {
  return a.id === b.id;
};

describe.skip("ExtendedReplaySubject Tests (Functionality)", () => {
  const MAX_BUFFER = 5e2;
  let replaySubject = new ExtendedReplaySubject<Dummy>(comparer, MAX_BUFFER);
  let data: Dummy[] = [];

  beforeEach(() => {
    data = getData(MAX_BUFFER);
    data.forEach(d => replaySubject.next(d));
  });

  it("Test if subscription fetch the expected data", () => {
    const arr = [];
    replaySubject.subscribe(d => arr.push(d)).unsubscribe();
    expect(arr.length).toBe(data.length);
  });

  it("Test if items deleted are notified and size is correct", done => {
    const deletedCount = data.filter(x => x.value > 50).length;
    replaySubject.deleted$.subscribe(items => {
      expect(items.length).toBe(deletedCount);
      done();
    });
    replaySubject.remove((d: Dummy) => d.value > 50);
  });

  it("Test if deleting n items leaves total - n items", () => {
    const deletedCount = data.filter(x => x.value > 50).length;
    const arr = [];
    replaySubject.remove((d: Dummy) => d.value > 50);
    replaySubject.subscribe(d => arr.push(d)).unsubscribe();
    expect(arr.length).toBe(data.length - deletedCount);
  });
});

describe.skip("ExtendedReplaySubject Tests (Performance)", () => {
  const MAX_BUFFER = 5e4;
  const TIMEOUT = 50;
  let replaySubject = new ExtendedReplaySubject<Dummy>(comparer, MAX_BUFFER);
  let data: Dummy[] = [];

  beforeAll(() => {
    data = getData(MAX_BUFFER);
    data.forEach(d => replaySubject.next(d));
  });

  it(
    "Test if subscription fetch the expected data",
    () => {
      const arr = [];
      replaySubject.subscribe(d => arr.push(d)).unsubscribe();
      expect(arr.length).toBe(data.length);
    },
    TIMEOUT
  );

  it(
    "Test if items deleted are notified and size is correct",
    done => {
      const deletedCount = data.filter(x => x.value > 50).length;
      replaySubject.deleted$.subscribe(items => {
        expect(items.length).toBe(deletedCount);
        done();
      });
      replaySubject.remove((d: Dummy) => d.value > 50);
    },
    TIMEOUT
  );

  it(
    "Test if deleting n items leaves total - n items",
    () => {
      const deletedCount = data.filter(x => x.value > 50).length;
      const arr = [];
      replaySubject.remove((d: Dummy) => d.value > 50);
      replaySubject.subscribe(d => arr.push(d)).unsubscribe();
      expect(arr.length).toBe(data.length - deletedCount);
    },
    TIMEOUT
  );
});

describe("Test various data manipulation", () => {
  const MAX_BUFFER = 50;
  const TIMEOUT = 120000;
  let replaySubject = new ExtendedReplaySubject<Dummy>(comparer, MAX_BUFFER);
  let data: Dummy[] = [];

  beforeAll(() => {
    data = getData(MAX_BUFFER);
    data.forEach(d => {
      d.published = true;
      replaySubject.next(d);
    });
  });
  beforeEach(() => {
    const items = data.filter(d => !d.published);
    items.forEach(i => {
      i.published = true;
      replaySubject.next(i);
    });
  });

  it(
    "it should check if periodical deletes are ok",
    done => {
      let isLastDelete = false;
      let deleteCount = 0;
      let delRecvCount = 0;
      const sub = replaySubject.deleted$.subscribe(items => {
        items.forEach(d => {
          d.published = false;
        });
        delRecvCount++;
        if (deleteCount === 20) {
          sub.unsubscribe();
          expect(delRecvCount).toBe(deleteCount);
          done();
        }
      });

      const handle = setInterval(() => {
        deleteCount++;
        const items = data.filter(d => d.published);
        const item = items[getRandom(0, items.length)];
        replaySubject.remove(i => item.id === i.id);
        deleteCount === 20 && clearInterval(handle);
      }, 1000);
    },
    TIMEOUT
  );

  it(
    "it should check if bulk deletes are ok",
    done => {
      let deleteSendCount = 0;
      let isFinished = false;

      const sub = replaySubject.deleted$.subscribe(items => {
        items.forEach(d => (d.published = false));
        if (isFinished) {
          sub.unsubscribe();
          const delCount = data.filter(d => !d.published).length;
          expect(delCount).toBe(deleteSendCount);
          done();
        }
      });

      deleteSendCount += data.filter(d => d.value < 20).length;
      replaySubject.remove(d => d.value < 20);
      deleteSendCount += data.filter(i => i.value >= 20 && i.value < 40).length;
      replaySubject.remove(d => d.value >= 20 && d.value < 40);
      deleteSendCount += data.filter(i => i.value >= 40 && i.value < 70).length;
      isFinished = true;
      replaySubject.remove(d => d.value >= 40 && d.value < 70);
    },
    TIMEOUT
  );
});
