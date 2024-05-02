// Certification api's

import express from 'express';
import cors from 'cors';
import * as certDbOps from './certDbOps.js'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/:empID/certs', auth, async function (request, response) {
    try {
        const empID = request.params.empID;
        let sortOption = request.query.sortOption || "CertName";
        let sortBy = request.query.sortBy || "ASC";

        const certs = await certDbOps.getAllCerts(empID, sortOption, sortBy);
        if (certs) {
            response.send({ Certificates: certs, Status: true, Count: certs.length });
        } else {
            response.status(400).send({ Error: certs });
        }
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ Error: error.message });
    }
});

app.post('/api/:empID/certs', auth, async function (request, response) {
    let cert;
    const empID = request.params.empID;

    if (request.get('Content-Type') !== 'application/json') {
        response.status(400).send({ Error: "Invalid JSON", Status: false });
    } else {
        cert = request.body;
        try {
            const responseData = await certDbOps.addCert(empID, cert);
            if (responseData.code == "SQLITE_CONSTRAINT") {
                response.status(400).send({ ResponseMessage: `Failed to insert the certificate because certificate is already existed or credential id is already existed!`, Status: false });
            } else {
                let insertedCert = responseData;
                response.status(200).send({ InsertedCertificate: insertedCert, ResponseMessage: "Certificate inserted successfully", Status: true });
            }

        } catch (error) {
            response.status(500).send({ Error: error, Status: false });
            console.log(error);
        }
    }
});

app.put('/api/:empID/certs', auth, async function (request, response) {
    if (request.get('Content-Type') !== 'application/json') {
        response.status(400).send({ Error: "Invalid JSON", Status: false });
    } else {
        try {
            const empID = request.params.empID;
            const cert = request.body;
            const certID = await certDbOps.getCertID(cert.Certificate.CertName, cert.Certificate.OrganizationName);

            const responseData = await certDbOps.editCert(empID, certID, cert);
            let affectedRow = responseData;
            if (affectedRow.changes == 1) {
                let editedCertificate = await certDbOps.getCertificate(empID, certID);
                response.status(200).send({ EditedCertificate: editedCertificate, ResponseMessage: "Certificate edited successfully", Status: true });
            } else if (affectedRow.changes == 0) {
                response.status(400).send({ ResponseMessage: `Failed to edit the certificate, ${affectedRow}`, Status: false });
            } else {
                response.status(500).send({ Error: responseData, Status: false });
            }

        } catch (error) {
            console.log(error);
            response.status(500).send({ Error: error, Status: false });
        }
    }
});

app.delete('/api/:empID/certs', auth, async function (request, response) {
    try {
        const empID = request.params.empID;
        const certName = request.query.CertName;
        const organizationName = request.query.OrganizationName;
        const certID = await certDbOps.getCertID(certName, organizationName);

        let deletedCertificate = await certDbOps.getCertificate(empID, certID);
        const responseData = await certDbOps.deleteCert(empID, certID);
        let affectedRow = responseData;
        if (affectedRow.changes == 1) {
            response.status(200).send({ DeletedCertificate: deletedCertificate, ResponseMessage: "Certificate deleted successfully", Status: true });
        } else if (affectedRow.changes == 0) {
            response.status(404).send({ ResponseMessage: `Failed to delete the certificate because, Certificate not found!`, Status: false });
        } else {
            response.status(500).send({ Error: responseData, Status: false });
        }

    } catch (error) {
        console.log(error);
        response.status(500).send({ Error: error, Status: false });
    }
});

app.get('/api/:empID/certs/searchCert', auth, async function (request, response) {
    const empID = request.params.empID;
    const queryParamsKeys = Object.keys(request.query);
    const optionKey = queryParamsKeys[0];
    const searchOption = request.query[optionKey];

    // const certs = await getCert(empID, searchOption);
    response.send(certs);
});

app.get('/api/certs/certInfo', async function (request, response) {
    const responseData = await certDbOps.getCertificatesDetails();
    let certificatesInfo = responseData;
    if (certificatesInfo) {
        response.status(200).send({ CertificatesInfo: certificatesInfo, Status: true });
    } else {
        response.status(500).send({Error: responseData, Status: false});
    }
})

app.get('/api/:empID/accountVerfication', auth, async function (request, response) {
    const empID = request.params.empID;
    response.status(200).json({ Status: true });
});

app.get('/api/:empID/accountDetails', auth, async function (request, response) {
    const empID = request.params.empID;
    const employeeDetails = await certDbOps.getEmployeeDetails(empID);
    response.send({ Status: true, Data: employeeDetails });
    console.log()
});

app.post('/api/login', async function (request, response) {
    const username = request.body.Username;
    let password = request.body.Password;
    const hashPassword = getHashingPassword(password);

    let token;
    let existingUser = await certDbOps.getUserDetails(username);
    if (!existingUser || existingUser.PasswordHash != hashPassword) {
        response.status(401).send({ ResponseMessage: "Invalid username or password", Status: false });
    } else {
        try {
            token = jwt.sign({ EmployeeID: existingUser.EmployeeID }, "empID", { expiresIn: "1d" });
            response.status(200).send({ Status: true, Data: { Token: token } })
        } catch (error) {
            response.send({ Error: `Oops, something went wrong!` });
            console.log(error);
        }
    }
});

app.post('/api/signup', async function (request, response) {
    const emp = request.body;
    emp.Password = getHashingPassword(emp.Password);

    const responseData = await certDbOps.register(emp);
    if (responseData.changes == 1) {
        response.status(200).send({ Status: true, ResponseMessage: "Registered Successfully!" });
    } else if (responseData.changes == 0) {
        response.status(400).send({ Status: false, ResponseMessage: "Failed to register you account, please try later!" });
    } else {
        if (responseData.code == "SQLITE_CONSTRAINT") {
            response.status(400).send({ ResponseMessage: `Username is already taken, please try with another one!`, Status: false });
        } else {
            response.status(500).send({ Error: responseData, Status: false });
        }
    }
});

app.listen(port, function () {
    console.log(`Server is running on port: ${port}.`);
});

function auth(request, response, next) {
    try {
        const token = request.headers.authorization.split(' ')[1];
        if (!token) {
            return response.status(200).send({ Status: false, ResponseMessage: "Error!Token was invalid." });
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
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}
