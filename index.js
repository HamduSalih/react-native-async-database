import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AsyncDB {
  constructor(props) {}

  /**
        This package aims to imitate firebase's firestore for local storage using react native's asyncstorage 
        1. It will feature collections, documents and subcollections
     */

  //function to create ids
  static _makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //create a new collection without data NOT NECESSARY
  static createEmptyCollection = async collectionName => {
    try {
      await AsyncStorage.setItem(collectionName, '').then(() => {
        console.log('New collection ', collectionName, 'created successfully');
      });
    } catch (error) {
      console.log(error);
    }
  };

  //merging data into existing doc
  static merge = async (collectionName, docName, data) => {
    //checks for data; it should be a non-empty object
    let dataCheck =
      typeof data === 'object' &&
      data !== null &&
      Object.keys(data).length !== 0;
    return new Promise((resolve, reject) => {
      if (!(typeof collectionName === 'string')) {
        console.error('Collection name must be a string');
        return;
      }

      if (docName !== undefined || docName != null) {
        if (!(typeof docName === 'string')) {
          console.error('Document name must be a string');
          return;
        }
      }
      if (!dataCheck) {
        console.error('Data must be a non-empty object');
        return;
      }

      //check if data entries are not undefined
      if (Object.values(data).includes(undefined)) {
        console.error('Data contains undefined values');
        return;
      }
      resolve();
    })
      .then(async value => {
        //setting docs here

        /**
        >>>first check if collection exists
        >>if it exists then check if doc exist
        >if doc exist then you merge else add doc
        >>>if collection does not exist 
        >> create collection and document and add data
         */

        let collection = await AsyncStorage.getItem(collectionName);
        //collection does not exist
        if (collection == null) {
          let dataToAdd = {id: docName, data: data};
          let newCollection = [dataToAdd];
          let setCollection = await AsyncStorage.setItem(
            collectionName,
            JSON.stringify(newCollection),
          ).then(async () => {
            let createdCollection = await AsyncStorage.getItem(collectionName);

            return new Promise((resolve, reject) => {
              resolve(JSON.parse(createdCollection));
            });
          });
          return setCollection[0];
        }

        // //collection exists
        if (collection !== null) {
          //check for doc
          let parsedCollection = JSON.parse(collection);
          let docArray = parsedCollection.filter((doc, index, array) => {
            let item = {};
            if (doc.id == docName) {
              return (item = {
                theDoc: doc,
              });
            }
          });

          //   console.log('\x1b[94m',docArray);

          let docExists = docArray.length > 0;
          //   //document exist
          if (docExists) {
            let theDoc = docArray[0].data;
            let mergedDoc = {
              ...theDoc,
              ...data,
            };

            //get index of doc in collection
            let indax = parsedCollection.findIndex(element => {
              return element.id == docArray[0].id;
            });

            // //replace doc with merged document
            let dataToAdd = {id: docName, data: mergedDoc};
            parsedCollection[indax] = dataToAdd;
            // console.log('\x1b[94m', parsedCollection);
            //set collection with updated collection
            let setCollection = await AsyncStorage.setItem(
              collectionName,
              JSON.stringify(parsedCollection),
            ).then(async () => {
              let createdCollection = await AsyncStorage.getItem(
                collectionName,
              );

              return new Promise((resolve, reject) => {
                resolve(JSON.parse(createdCollection));
              });
            });

            return setCollection[indax];
          }

          //   //document does not exist
          if (!docExists) {
            let dataToAdd = {id: docName, data: data};
            parsedCollection.push(dataToAdd);
            //set collection with updated collection
            let setCollection = await AsyncStorage.setItem(
              collectionName,
              JSON.stringify(parsedCollection),
            ).then(async () => {
              let createdCollection = await AsyncStorage.getItem(
                collectionName,
              );

              return new Promise((resolve, reject) => {
                resolve(JSON.parse(createdCollection));
              });
            });
            return setCollection[parsedCollection.length - 1];
          }
        }
      })
      .catch(err => console.log(err));
  };

  //setting a document
  static set = async (collectionName, docName, data) => {
    //checks for data; it should be a non-empty object
    let dataCheck =
      typeof data === 'object' &&
      data !== null &&
      Object.keys(data).length !== 0;

    return new Promise((resolve, reject) => {
      if (!(typeof collectionName === 'string')) {
        console.error('Collection name must be a string');
        return;
      }

      if (docName !== undefined || docName != null) {
        if (!(typeof docName === 'string')) {
          console.error('Document name must be a string');
          return;
        }
      }
      if (!dataCheck) {
        console.error('Data must be a non-empty object');
        return;
      }

      //check if data entries are not undefined
      if (
        Object.values(data).includes(undefined) ||
        Object.values(data).includes(null)
      ) {
        console.error('Data contains undefined values');
        return;
      }
      resolve();
    })
      .then(async value => {
        //setting docs here
        let dataToAdd = {id: docName, data: data};
        let newCollection = [dataToAdd];
        let setCollection = await AsyncStorage.setItem(
          collectionName,
          JSON.stringify(newCollection),
        ).then(async () => {
          let createdCollection = await AsyncStorage.getItem(collectionName);

          return new Promise((resolve, reject) => {
            resolve(JSON.parse(createdCollection));
          });
        });

        return setCollection[0];
      })
      .catch(err => console.log(err));
  };

  //add document without specfying doc id
  static add = async (collectionName, data) => {
    //checks for data; it should be a non-empty object
    let dataCheck =
      typeof data === 'object' &&
      data !== null &&
      Object.keys(data).length !== 0;

    let docName = this._makeid(21);
    // console.log('\x1b[97m', docName);

    return new Promise((resolve, reject) => {
      if (!(typeof collectionName === 'string')) {
        console.error('Collection name must be a string');
        return;
      }

      if (!dataCheck) {
        console.error('Data must be a non-empty object');
        return;
      }

      //check if data entries are not undefined
      if (
        Object.values(data).includes(undefined) ||
        Object.values(data).includes(null)
      ) {
        console.error('Data contains undefined values');
        return;
      }
      resolve();
    })
      .then(async value => {
        //setting docs here
        //check if collection exist
        let collection = await AsyncStorage.getItem(collectionName);
        if (collection == null) {
          let dataToAdd = {id: docName, data: data};
          let newCollection = [dataToAdd];
          let setCollection = await AsyncStorage.setItem(
            collectionName,
            JSON.stringify(newCollection),
          ).then(async () => {
            let createdCollection = await AsyncStorage.getItem(collectionName);

            return new Promise((resolve, reject) => {
              resolve(JSON.parse(createdCollection));
            });
          });

          return setCollection[0];
        } else {
          let Collection = JSON.parse(collection);
          let dataToAdd = {id: docName, data: data};
          let newCollection = [...Collection, dataToAdd];
          let setCollection = await AsyncStorage.setItem(
            collectionName,
            JSON.stringify(newCollection),
          ).then(async () => {
            let createdCollection = await AsyncStorage.getItem(collectionName);

            return new Promise((resolve, reject) => {
              resolve(JSON.parse(createdCollection));
            });
          });
          let indax = Collection.length

          return setCollection[indax];
        }
      })
      .catch(err => console.log(err));
  };

  /**READING FUNCTIONS */

  static getDoc = async (collectionName, docName) => {
    //first check if collection exists
    let collection = await AsyncStorage.getItem(collectionName);
    let doc;
    // console.log(collection);
    return new Promise((resolve, reject) => {
      if (collection == null) {
        console.error('Collection not found');
        return;
      } else {
        //check if doc exists
        let Collection = JSON.parse(collection);
        doc = Collection.filter(doc => {
          return doc.id == docName;
        });

        if (doc.length < 1) {
          let Doc = {
            exists: false,
          };
          reject();
        } else {
          let Doc = {
            ...doc[0],
            exists: true,
          };
          resolve(Doc);
        }
      }
    }).catch(err => {
      return err;
    });
  };

  static getMultiple = async (collectionName, field, condition, value) => {
    //check if collection exists
    let Collection = await AsyncStorage.getItem(collectionName);
    var collection = JSON.parse(Collection);
    if (collection == null) {
      console.error('Collection not found');
      return;
    }

    let validateQuery =
      field == undefined && condition == undefined && value == undefined;

    let validateQueryValues =
      !(typeof condition === 'string') || !(typeof field === 'string');

    if (collection !== null) {
      if (validateQuery) {
        //user wants to get all docs in collection
        return new Promise((resolve, reject) => {
          resolve(collection);
        });
      }

      if (!validateQuery && !validateQueryValues) {
        //check query values
        //currently ==, >, <, in for arrays
        if (condition == '==') {
          //check is parameter is an object
          if (field.includes('.')) {
            //then it is an object
            let splitField = field.split('.');
            let objectName = splitField[0];
            let objectKey = splitField[1];
            let retreivedDoc = collection.filter(doc => {
              if (typeof doc === 'object') {
                return doc['data'][objectName][objectKey] == value;
              }
            });

            return new Promise((resolve, reject) => {
              resolve(retreivedDoc);
            });
          } else {
            let retreivedDoc = collection.filter(doc => {
              return doc['data'][field] == value;
            });
            return new Promise((resolve, reject) => {
              resolve(retreivedDoc);
            });
          }
        }

        if (condition == '>') {
          //check is parameter is an object
          if (field.includes('.')) {
            //then it is an object
            let splitField = field.split('.');
            let objectName = splitField[0];
            let objectKey = splitField[1];
            let retreivedDoc = collection.filter(doc => {
              if (typeof doc === 'object') {
                return doc['data'][objectName][objectKey] > value;
              }
            });

            return new Promise((resolve, reject) => {
              resolve(retreivedDoc);
            });
          } else {
            let retreivedDoc = collection.filter(doc => {
              return doc['data'][field] > value;
            });
            return new Promise((resolve, reject) => {
              resolve(retreivedDoc);
            });
          }
        }

        if (condition == '<') {
          //check is parameter is an object
          if (field.includes('.')) {
            //then it is an object
            let splitField = field.split('.');
            let objectName = splitField[0];
            let objectKey = splitField[1];
            let retreivedDoc = collection.filter(doc => {
              if (typeof doc === 'object') {
                return doc['data'][objectName][objectKey] < value;
              }
            });

            return new Promise((resolve, reject) => {
              resolve(retreivedDoc);
            });
          } else {
            let retreivedDoc = collection.filter(doc => {
              return doc['data'][field] < value;
            });
            return new Promise((resolve, reject) => {
              resolve(retreivedDoc);
            });
          }
        }

        if (condition == 'in') {
          //check is parameter is an object
          if (field.includes('.')) {
            //then it is an object
            let splitField = field.split('.');
            let objectName = splitField[0];
            let objectKey = splitField[1];
            let retreivedDoc = collection.filter(doc => {
              if (typeof doc === 'object') {
                return doc['data'][objectName][objectKey].includes(value);
              }
            });

            return new Promise((resolve, reject) => {
              resolve(retreivedDoc);
            });
          } else {
            let retreivedDoc = collection.filter(doc => {
              return doc['data'][field].includes(value);
            });
            return new Promise((resolve, reject) => {
              resolve(retreivedDoc);
            });
          }
        }
      }
    }
  };
}
