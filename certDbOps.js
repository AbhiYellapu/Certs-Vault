// Cert Vault database operations

import { response } from "express";
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
        response = certs;
    } catch (error) {
        response = error;
    }
    return response;
}

async function addCert(empID, cert) {
    let response;
    try {
        let insertQuery = `INSERT INTO EmployeeCertificates (CertID, EmployeeID, IssueDate, ExpireDate, CredentialID, CredentialURL) VALUES (?, ?, ?, ?, ?, ?);`
        let affectedRow = await db.run(insertQuery, (await getCertID(cert.Certificate.CertName, cert.Certificate.OrganizationName)), empID, cert.Certificate.IssueDate, cert.Certificate.ExpireDate, cert.Certificate.CredentialID, cert.Certificate.CredentialURL);

        let insertedCertificate = await getAffectedRow(affectedRow.lastID);
        response = insertedCertificate;
    } catch (error) {
        response = error;
    }
    return response;
}

async function editCert(empID, certID, cert) {
    let response;
    try {
        let editQuery = `UPDATE EmployeeCertificates SET IssueDate = ?,  ExpireDate = ?, CredentialID = ?, CredentialURL = ? WHERE EmployeeID = ? AND CertID = ?;`;
        let affectedRow = await db.run(editQuery, cert.Certificate.IssueDate, cert.Certificate.ExpireDate, cert.Certificate.CredentialID, cert.Certificate.CredentialURL, empID, certID);

        response = affectedRow;
    } catch (error) {
        response = error;
    }
    return response;
}

async function deleteCert(empID, certID) {
    let response;
    try {
        let deleteQuery = `DELETE FROM EmployeeCertificates WHERE CertID = ? AND EmployeeID = ?;`;
        let affectedRow = await db.run(deleteQuery, certID, empID);

        response = affectedRow;
    } catch (error) {
        response = error;
    }
    return response;
}

async function getCertID(certName, orgName) {
    let certIDQuery = `SELECT CertID FROM Certificate WHERE CertName = '${certName}' AND OrganizationName = '${orgName}'`;
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

async function getUserDetails(username) {
    let existingUser;
    try {
        existingUser = await db.get("SELECT * FROM User WHERE Username = ?", username);
    } catch (error) {
        console.log(error);
    }
    return existingUser;
}

async function getEmployeeDetails(employeeID) {
    let query = `SELECT * FROM Employee WHERE EmployeeID = ?`;
    return await db.get(query, employeeID);
}

async function getCertificatesDetails() {
    let response;
    try {
        let query = `SELECT * FROM CERTIFICATE`;
        let certificatesInfo = await db.all(query);
        response = certificatesInfo;
    } catch (error) {
        response = error;
    }
    return response;
}

async function register(emp) {
    let response;
    try {
        let empIDResult = await (db.get(`select (rowid + 1) as empID from Employee order by rowid desc limit 1`));
        let empID = empIDResult.empID;
        empID = `E000${empID}`;
        let query = `INSERT INTO Employee (EmployeeID, EmployeeName, DOB, Email, MobileNumber) VALUES (?, ?, ?, ?, ?)`;
        let affectedRow = await db.run(query, empID, emp.EmployeeName, emp.DOB, emp.Email, emp.MobileNumber);
        affectedRow = await db.run(`INSERT INTO User (EmployeeID, Username, PasswordHash) VALUES (?, ?, ?)`, empID, emp.Username, emp.Password);
        response = affectedRow;
    } catch (error) {
        response = error;
    }
    return response;
}
export { addCert, editCert, getAllCerts, deleteCert, getUserDetails, getEmployeeDetails, getCertificatesDetails, register, getCertID, getCertificate };
