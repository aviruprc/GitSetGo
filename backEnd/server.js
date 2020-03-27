'use strict';
const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
 projectId: 'roidtc-0323-attendee114',
//   keyFilename: '/path/to/keyfile.json',
});
// express is a nodejs web server
// https://www.npmjs.com/package/express
const express = require('express');

// converts content in the request into parameter req.body
// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');

// create the server
const app = express();

// the backend server will parse json, not a form request
app.use(bodyParser.json());

// mock events data - for a real solution this data should be coming 
// from a cloud data store
const Events = {
    events: [
        
    ]
};


let eventsRef = firestore.collection('eventsDatabase');
let allEvents = eventsRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      Events.events.push(doc.data());
      console.log(doc.data());
    });
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });

// health endpoint - returns an empty array
app.get('/', (req, res) => {
    res.json([]);
});

// version endpoint to provide easy convient method to demonstrating tests pass/fail
app.get('/version', (req, res) => {
    res.json({ version: '1.0.0' });
});


// mock events endpoint. this would be replaced by a call to a datastore
// if you went on to develop this as a real application.
app.get('/events', (req, res) => {

//     let eventsRef = firestore.collection('eventsDatabase');
// let allEvents = eventsRef.get()
//   .then(snapshot => {
//     snapshot.forEach(doc => {
//       Events.events.push(doc.data());
//       console.log(doc.data());
//     });
//   })
//   .catch(err => {
//     console.log('Error getting documents', err);
//   });
    res.json(Events);
});

// Adds an event - in a real solution, this would insert into a cloud datastore.
// Currently this simply adds an event to the mock array in memory
// this will produce unexpected behavior in a stateless kubernetes cluster. 
app.post('/event', (req, res) => {
    
    // create a new object from the json data and add an id
    const ev = { 
        eventDetails: req.body.title, 
        eventLocation: req.body.description,
       }
    let addDoc = firestore.collection('eventsDatabase').add(ev).then(ref => 
    {
        console.log('Added document with ID: ', ref.id);
        Events.events.push(ev);
        console.log(Events.events);
      })
      res.json(Events);
    
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const PORT = 8082;
const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Events app listening at http://${host}:${port}`);
});

module.exports = app;