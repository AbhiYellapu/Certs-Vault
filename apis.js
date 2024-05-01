// Certification api's

import express from 'express';
import cors from 'cors';
import * as certDbOps from './certDbOps.js'
import jwt from 'jsonwebtoken';

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/:empID/certs', auth, async function (request, response) {
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

app.post('/api/:empID/certs', auth, async function (request, response) {
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

app.put('/api/:empID/certs', auth, async function (request, response) {
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

app.delete('/api/:empID/certs', auth, async function (request, response) {
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

app.get('/api/:empID/certs/searchCert', auth, async function (request, response) {
    let empID = request.params.empID;
    const queryParamsKeys = Object.keys(request.query);
    let optionKey = queryParamsKeys[0];
    let searchOption = request.query[optionKey];

    // const certs = await getCert(empID, searchOption);
    response.send(certs);
});

app.get('/api/:empID/accountVerfication', auth, async function (request, response) {
    let empID = request.params.empID;
    console.log(empID);
    response.status(200).json({ Status: true });
});

app.get('/api/:empID/accountDetails', auth, async function (request, response) {
    let empID = request.params.empID;
    console.log(empID);
    let employeeDetails = await certDbOps.getEmployeeDetails(empID);
    response.send({ Status: true, Data: employeeDetails });
    console.log()
});

app.post('/api/login', async function (request, response) {
    let username = request.body.Username;
    let password = request.body.Password;
    let hashPassword = getHashingPassword(password);

    let token;
    let existingUser = await certDbOps.getUserDetails(username);
    if (!existingUser || existingUser.PasswordHash != hashPassword) {
        response.status(401).send({ ResponseMessage: "Invalid username or password" });
    } else {
        try {
            token = jwt.sign({ EmployeeID: existingUser.EmployeeID }, "empID", { expiresIn: "1d" });
            response.status(200).send({ Status: true, Data: { Token: token } })
        } catch (error) {
            response.send({ error: `Oops, something went wrong!` });
            console.log(error);
        }
    }
});

app.post('/api/signup', async function (request, response) {
    let emp = request.body;
    emp.Password = getHashingPassword(emp.Password);
    console.log(emp);
    let responseData = await certDbOps.register(emp);
    response.status(responseData.ResponseCode).send(responseData.Data);
});

app.listen(port, function () {
    console.log(`Server is running on port: ${port}.`);
});

function auth(request, response, next) {
    try {
        const token = request.headers.authorization.split(' ')[1];
        if (!token) {
            return response.status(200).send({ Status: false, ResponseMessage: "Error!Token was not provided." });
        }
        const decodedToken = jwt.verify(token, "empID");
        // request.empID = decodedToken.EmployeeID;
        request.params.empID = decodedToken.EmployeeID;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return response.status(401).json({ Status: false, ResponseMessage: `${error.message}` });
        }
        next(error);
    }
}

function getHashingPassword(password) {
    
