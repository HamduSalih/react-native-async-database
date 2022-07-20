# react-native-async-database

A package built on top of AsyncStorage to easily use localstorage as a database like firebase/firestore.

This package aims to imitate firebase's firestore for local storage using react native's asyncstorage

#### Note: Database means localstorage

## What you can do with current version:

- Create collections
- Add Documents to colletions
- Merge data into existing
- Get data once from database
- Get multiple documents from a collection
- Get specific documents from a collection using a query

## Installation
> yarn add react-native-async-database
> npm install react-native-async-database

## Usage
> import AsyncDb from 'react-native-async-database'

## Function Examples

### Create or overwrite a single document:

#### Syntax

AsyncDb.set(collectionName as String, documentId as String, data as Object).then(doc => {
console.log(doc.id, doc.data);
});

#### Example

AsyncDb.set('users', '1234567890', {name: 'Hamdu', age: 25, messages:['Hello', 'Hi', 'Later'], details: {surname: 'Salifu', middlename: 'Napari'}})
.then(doc => {
console.log(doc.data);
});

### Merge data into existing document:

#### Syntax

AsyncDb.merge(collectionName as String, documentId as String, data as Object).then(doc => {
console.log(doc.id, doc.data);
});

#### Example

AsyncDb.merge('users', '1234567890', {name: 'Hamdu', age: 25, messages:['Hello', 'Hi', 'Later'], details: {surname: 'Salifu', middlename: 'Napari'}})
.then(doc => {
console.log(doc.data);
});

### Add document without specifying document id:

#### Syntax

AsyncDb.add(collectionName as String, data as Object).then(doc => {
console.log(doc.id, doc.data);
});

#### Example

AsyncDb.add('users', {
name: 'hamdu',
age: 25,
messages: ['habiba lengey', 'yes'],
details: {
surname: 'salifu',
middlename: 'napari',
},
}).then(doc => {
console.log( doc);
});

### Get data once:

#### Syntax

AsyncDb.getDoc(collectionName as String, documentId as String).then(doc => {
console.log(doc.id, doc.data);
});

#### Example

AsyncDb.getDoc('users', '3BP3wCT7cgjqk2CwPeWQB')
.then(doc => {
console.log(doc);
})
.catch(err => {
console.log(err);
});

### Get all docs in a collection:

#### Syntax

AsyncDb.getMultiple(collectionName as String).then(doc => {
console.log(snapshot);
});

#### Example

AsyncDb.getMultiple('users').then(snapshot => {
console.log(snapshot);
});

### Get specific docs using a query:

#### Syntax

##### Note: The last three parameters constitute the query and the currently acceptable conditions are:

- Equals to ('==')
- Greater than ('>')
- Less than ('<')
- Includes ('in'). This condition is used to query arrays as will be seen in examples

AsyncDb.getMultiple(collectionName as String, fieldName as String, condition as String, value).then(doc => {
console.log(doc.id, doc.data);
});

#### Example 1: Querying a collection for a document whose messages field(an array) includes the value 'yes'.

AsyncDb.getMultiple('user', 'messages', 'in', 'yes').then(doc => {
console.log(doc);
});

#### Example 2: You can also query objects in a document.

AsyncDb.getMultiple('user', 'details.surname', '==', 'salifu').then(doc => {
console.log(doc);
});

Where 'details' is an object in a document

#### Example 3

AsyncDb.getMultiple('user', 'age', '>', 30').then(doc => {
console.log(doc);
});

#### Example 4

AsyncDb.getMultiple('user', 'name', '==', 'Hamdu').then(doc => {
console.log(doc);
});

#### Example 5

AsyncDb.getMultiple('user', 'distance', '<', 5000).then(doc => {
console.log(doc);
});
