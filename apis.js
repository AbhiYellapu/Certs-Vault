// Certification api's

import express from 'express'
import * as certDbOps from './certDbOps.js'

const port = 3000;
const app = express();
app.use(express.json());

app.get('/api/:empID/certs', async function (request, response) {
    try {
        let empID = request.params.empID;
        let sortOption = request.query.sortOption || "CertName";
        let sortBy = request.query.sortBy || "ASC";

        let responseData = await certDbOps.getAllCerts(empID, sortOption, sortBy);
        response.status(responseData.ResponseCode).send(responseData.Data);
    } catch (error) {
        console.log(error);
        response.status(500).send({ Error: error, Status: false });
    }
});

app.post('/api/:empID/certs', async function (request, response) {
    let cert;
    let empID = request.params.empID;

    if (request.get('Content-Type') !== 'application/json') {
        response.status(400).send({ Error: "Invalid JSON", Status: false });
    } else {
        cert = request.body;
        try {
            let responseData = await certDbOps.addCert(empID, cert);
            response.status(responseData.ResponseCode).send(responseData.Data);
        } catch (error) {
            response.status(500).send({ Error: error, Status: false });
            console.log(error);
        }
    }
});

app.put('/api/:empID/certs', async function (request, response) {
    try {
        let empID = request.params.empID;
        let certID = request.query.certID;
        let cert = request.body;

        let responseData = await certDbOps.editCert(empID, certID, cert);
        response.status(responseData.ResponseCode).send(responseData.Data);
    } catch (error) {
        console.log(error);
        response.status(500).send({ Error: error, Status: false });
    }
});

app.delete('/api/:empID/certs', async function (request, response) {
    try {
        let empID = request.params.empID;
        let certID = request.query.certID;

        let responseData = await certDbOps.deleteCert(empID, certID);
        response.status(responseData.ResponseCode).send(responseData.Data);
    } catch (error) {
        console.log(error);
        response.status(500).send({ Error: error, Status: false });
    }
});

app.get('/api/:empID/certs/searchCert', async function (request, response) {
    let empID = request.params.empID;
    const queryParamsKeys = Object.keys(request.query);
    let optionKey = queryParamsKeys[0];
    let searchOption = request.query[optionKey];

    // const certs = await getCert(empID, searchOption);
    response.send(certs);
});

app.listen(port, function () {
    console.log(`Server is running on port: ${port}.`);
});
