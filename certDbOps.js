// Cert Vault database operations

import { connectToDatabase } from "./dbconnection.js";

const db = await connectToDatabase();

async function getAllCerts(empID, sortOption, sortBy) {
    let response;
    try {
        let selectQuery = `SELECT Certificate.CertName, Certificate.OrganizationName, EmployeeCertificates.IssueDate, EmployeeCertificates.ExpireDate, EmployeeCertificates.CredentialID, EmployeeCertificates.CredentialURL 
        FROM EmployeeCertificates, Certificate 
        WHERE EmployeeCertificates.CertID = Certificate.CertID AND EmployeeCertificates.EmployeeID = ? 
        ORDER BY ${sortOption} ${sortBy};`

        const certs = await db.all(selectQuery, empID);
        response = ({ ResponseCode: 200, Data: { Certificates: certs, Status: true, Count: certs.length } });
    } catch (error) {
        console.log(error);
        response = ({ ResponseCode: 500, Data: { Error: error, Status: false } });
    }
    return response;
}

async function addCert(empID, cert) {
    let response;
    try {
        let insertQuery = `INSERT INTO EmployeeCertificates (CertID, EmployeeID, IssueDate, ExpireDate, CredentialID, CredentialURL) VALUES (?, ?, ?, ?, ?, ?);`
        let affectedRow = await db.run(insertQuery, (await getCertID(cert.Certificate.CertName)), empID, cert.Certificate.IssueDate, cert.Certificate.ExpireDate, cert.Certificate.CredentialID, cert.Certificate.CredentialURL);

        let insertedCertificate = await getAffectedRow(affectedRow.lastID);
        response = ({ ResponseCode: 201, Data: { InsertedCertificate: insertedCertificate, ResponseMessage: "Certificate inserted successfully", Status: true } });

    } catch (error) {
        if (error.code == "SQLITE_CONSTRAINT") {
            response = ({ ResponseCode: 400, Data: { Error: `Failed to insert the certificate, Credential ID[${cert.Certificate.CredentialID}] already existed`, Status: false } });
        } else {
            response = ({ ResponseCode: 500, Data: { Error: error, Status: false } });
        }
        console.log(error);
    }
    return response;
}

async function editCert(empID, certID, cert) {
    let response;
    try {
        let editQuery = `UPDATE EmployeeCertificates SET IssueDate = ?,  ExpireDate = ?, CredentialID = ?, CredentialURL = ? WHERE EmployeeID = ? AND CertID = ?;`;
        let affectedRow = await db.run(editQuery, cert.Certificate.IssueDate, cert.Certificate.ExpireDate, cert.Certificate.CredentialID, cert.Certificate.CredentialURL, empID, certID);

        if (affectedRow.changes == 1) {
            let editedCertificate = await getCertificate(empID, certID);
            response = ({ ResponseCode: 200, Data: { EditedCertificate: editedCertificate, ResponseMessage: "Certificate edited successfully", Status: true } });
        } else {
            response = ({ ResponseCode: 400, Data: { ResponseMessage: 'Failed to edit the certificate', Status: false } });
        }
    } catch (error) {
        console.log(error);
        response = ({ ResponseCode: 500, Data: { Error: error, Status: false } });
    }
    return response;
}

async function deleteCert(empID, certID) {
    let response;
    try {
        let deleteQuery = `DELETE FROM EmployeeCertificates WHERE CertID = ? AND EmployeeID = ?;`;

        let deletedCertificate = await getCertificate(empID, certID);
        let affectedRow = await db.run(deleteQuery, certID, empID);

        if (affectedRow.changes == 1) {
            response = ({ ResponseCode: 200, Data: { DeletedCertificate: deletedCertificate, ResponseMessage: "Certificate deleted successfully", Status: true } });
        } else {
            response = ({ ResponseCode: 400, Data: { ResponseMessage: 'Failed to delete the certificate because, Certificate not found', Status: false } });
        }
    } catch (error) {
        console.log(error);
        response.status(500).send({ ResponseCode: 500, Data: { Error: error, Status: false } });
    }
    return response;
}

async function getCertID(certName) {
    let certIDQuery = `SELECT CertID FROM Certificate WHERE CertName = '${certName}'`;
    try {
        return (await db.get(certIDQuery)).CertID;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getAffectedRow(affectedRowID) {
    let affectedRowQuery = `SELECT Certificate.CertName, Certificate.OrganizationName, EmployeeCertificates.IssueDate, EmployeeCertificates.ExpireDate, EmployeeCertificates.CredentialID, EmployeeCertificates.CredentialURL
    FROM Certificate JOIN EmployeeCertificates ON Certificate.CertID = EmployeeCertificates.CertID
    WHERE EmployeeCertificates.rowid = ?`;
    try {
        return (await db.get(affectedRowQuery, affectedRowID));
    } catch (error) {
        return error;
    }
}

async function getCertificate(empID, certID) {
    let query = `SELECT Certificate.CertName, Certificate.OrganizationName, EmployeeCertificates.IssueDate, EmployeeCertificates.ExpireDate, EmployeeCertificates.CredentialID, EmployeeCertificates.CredentialURL
    FROM Certificate JOIN EmployeeCertificates ON Certificate.CertID = EmployeeCertificates.CertID
    WHERE EmployeeCertificates.EmployeeID = ? AND EmployeeCertificates.CertID = ?`;
    try {
        return (await db.get(query, empID, certID));
    } catch (error) {
        return error;
    }
}

export { addCert, editCert, getAllCerts, deleteCert };
