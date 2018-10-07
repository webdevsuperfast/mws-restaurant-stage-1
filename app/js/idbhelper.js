import idb from 'idb';
// let idb = require('idb');

const dbPromise = idb.open('udacity-restaurant-db', 3, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurants', { keyPath: 'id', unique: true });
    case 1:
      const reviewStore = upgradeDB.createObjectStore('reviews', { autoIncrement: true });
      reviewStore.createIndex('restaurant_id', 'restaurant_id');
    case 2:
      upgradeDB.createObjectStore('offline', { autoIncrement: true });
  }
});

self.dbPromise = dbPromise;


const wait = function (ms) {
  return new Promise(function (resolve, reject) {
    window.setTimeout(function () {
      resolve(ms);
      reject(ms);
    }, ms);
  });
};

self.wait = wait;


const showOffline = () => {
  document.querySelector('#offline').setAttribute('aria-hidden', false);
  document.querySelector('#offline').classList.add('show');
    
  wait(8000).then(() => {
    document.querySelector('#offline').setAttribute('aria-hidden', true);
    document.querySelector('#offline').classList.remove('show');
  });
};

self.showOffline = showOffline;

// IndexedDB object with get, set, getAll, & getAllIdx methods
// https://github.com/jakearchibald/idb
const idbKeyVal = {
  get(store, key) {
    return dbPromise.then(db => {
      return db
        .transaction(store)
        .objectStore(store)
        .get(key);
    });
  },
  getAll(store) {
    return dbPromise.then(db => {
      return db
        .transaction(store)
        .objectStore(store)
        .getAll();
    });
  },
  getAllIdx(store, idx, key) {
    return dbPromise.then(db => {
      return db
        .transaction(store)
        .objectStore(store)
        .index(idx)
        .getAll(key);
    });
  },
  set(store, val) {
    return dbPromise.then(db => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(val);
      return tx.complete;
    });
  },
  setReturnId(store, val) {
    return dbPromise.then(db => {
      const tx = db.transaction(store, 'readwrite');
      const pk = tx
        .objectStore(store)
        .put(val);
      tx.complete;
      return pk;
    });
  },
  delete(store, key) {
    return dbPromise.then(db => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      return tx.complete;
    });
  },
  openCursor(store) {
    return dbPromise.then(db => {
      return db.transaction(store, 'readwrite')
        .objectStore(store)
        .openCursor();
    });
  }



  /*
  setWithKey(store, key, val) {
    return dbPromise.then(db => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(val, key);
      return tx.complete;
    });
  },
  clear(store) {
    return dbPromise.then(db => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      return tx.complete;
    });
  },
  keys(store) {
    return dbPromise.then(db => {
      const tx = db.transaction(store);
      const keys = [];
      const objStore = tx.objectStore(store);

      // This would be objStore.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      (objStore.iterateKeyCursor || objStore.iterateCursor).call(objStore, cursor => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  }
  */
};

// CL.log('my class from outside');
self.idbKeyVal = idbKeyVal;


/*
const dbPromise = idb.open('udacity-restaurant-db', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      // var keyValStore = upgradeDB.createObjectStore('restaurants', {
      //   keyPath: 'id'
      // });
      // keyValStore.createIndex('id', 'id');
      upgradeDB.createObjectStore('restaurants');
    case 1:
      upgradeDB.createObjectStore('people', {
        keyPath: 'name'
      });
    case 2:
      var peopleStore = upgradeDB.transaction.objectStore('people');
      peopleStore.createIndex('animal', 'favoriteAnimal');
    case 3:
      // var peopleStore = upgradeDB.transaction.objectStore('people');
      peopleStore.createIndex('age', 'age');
  } 
});

dbPromise.then(db => {
  const tx = db.transaction('people', 'readwrite');
  const peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'James Priest',
    age: 48,
    favoriteAnimal: 'dog'
  });
  peopleStore.put({
    name: 'Pacifist Dove',
    age: 20,
    favoriteAnimal: 'cat'
  });
  peopleStore.put({
    name: 'Onika Maraj',
    age: 35,
    favoriteAnimal: 'lioness'
  });

  return tx.complete;
});

dbPromise.then(db => {
  const tx = db.transaction('people');
  const peopleStore = tx.objectStore('people');
  const animalIndex = peopleStore.index('animal');
  const ageIndex = peopleStore.index('age');

  // return peopleStore.getAll();
  return ageIndex.getAll();
}).then(people => {
  console.log('Ordered by Age:', people);
});
*/
