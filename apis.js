// Certification api's

import express from 'express'
import sqlite3 from 'sqlite3'
import {connectToDatabase} from './dbconnection.js'
import {getEmployeeDetails} from './getEmployee.js'

const port = 3000;
const app = express();

const db = await connectToDatabase();

app.get('/api/me/certs', async function (request, response) {
    const queryParamsKeys = Object.keys(request.query);
    let empID  = request.query.EmployeeID;
    let optionKey = queryParamsKeys[1];

    if (optionKey == "Sort") {
        let sortOption = request.query.Sort;
        // const certs = await getAllCerts(db, empID, sortOption);
        // response.send(certs);
    } else {
        let searchOption = request.query[optionKey];
        // const certs = await getCert(db, empID, searchOption);
        // response.send(certs);
    }
    response.send(`{"EmployeeID": "${empID}", "${queryParamsKeys[1]}": "${request.query[queryParamsKeys[1]]}"}`);
});

app.get('/api/account', async function (request, response) {
    let empID  = request.query.EmployeeID;
    const employee = await getEmployeeDetails(db, empID);
    response.send(employee);
})

api.post('/api/me/insertCert', function (request, response) {
    response.send("");
});

api.put('/api/me/updateCert', function (request, response) {
    response.send("");
});

api.delete('/api/me/updateCert', function (request, response) {
    response.send("");
});

api.get('api/loginCredentials', function (request, response) {
    response.json
})

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});