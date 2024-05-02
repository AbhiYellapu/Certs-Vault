// Cert Vault operations

let token;
const employeeCertTokenKey = "EmployeeJwtKey";

window.onload = async function () {
    token = localStorage.getItem(employeeCertTokenKey);
    let isValidToken = await userAuthentication(token)
    if (token && isValidToken) {
        console.log("Session not expired!");
    } else {
        createLoginSignupButtons();
        token = null;
    }
    if (token) {
        performOperations();
    }
}

function createLoginSignupButtons() {
    let menuBar = document.getElementById("menuBar");
    menuBar.style.float = "right";
    let loginButton = document.createElement("button");
    loginButton.innerHTML = "login";
    loginButton.onclick = () => {
        createLoginForm();
    }
    let registerButton = document.createElement("button");
    registerButton.innerHTML = "Register";
    registerButton.onclick = () => {
        createRegisterForm();
    }
    menuBar.appendChild(loginButton);
    menuBar.appendChild(registerButton);
}

function createLoginForm() {
    let loginForm = `<form id="loginForm">
    <input type="text" placeholder="Username" name="username" id="username"><br>
    <input type="password" placeholder="Password" name="password" id="password"><br>
    <button type="button" onclick= "login()">Login</button>
    </form>`;
    document.getElementById("authForms").innerHTML = loginForm;
}

function createRegisterForm() {
    var registerForm = `<form id="registerForm">
        <input type="text" placeholder="Employee Name" id="employeeName" required><br>
        <input type="date" placeholder="DOB" id="dob"><br>
        <input type="email" placeholder="Email" id="email" required><br>
        <input type="tel" placeholder="Mobile Number" id="mobileNumber" required><br>
        <input type="text" placeholder="Username" name="username" id="username" required><br>
        <input type="password" placeholder="Password" name="password" id="password" required><br>
        <button type="button" onclick="register()">Register</button><br>
    </form>`;
    document.getElementById("authForms").innerHTML = registerForm;
}

async function register() {
    try {
        let payloadData = getRegistrationFormData();
        const response = await fetch(`http://localhost:3000/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadData)
        });

        const data = await response.json();
        console.log(data);
        if (response.status == 200) {
            if (data.Status == true) {
                alert("Registered successfully!");
                alert("Now login!")
                document.getElementById('authForms').innerHTML = "";
            }
        } else if (response.status == 400) {
            alert(`${data.ResponseMessage}`);
        } else {
            alert(`Oops something went wrong! try again`)
        }
    } catch (error) {
        console.log(error);
    }
}

function getRegistrationFormData() {
    const employeeName = document.getElementById('employeeName').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const formData = {
        "EmployeeName": employeeName,
        "DOB": dob,
        "Email": email,
        "MobileNumber": mobileNumber,
        "Username": username,
        "Password": password
    };

    return formData;
}

async function login() {
    try {
        let payloadData = getLoginFormData();
        const response = await fetch(`http://localhost:3000/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadData)
        });

        const data = await response.json();
        if (response.status == 200) {
            if (data.Status == true) {
                token = data.Data.Token;
                localStorage.setItem(employeeCertTokenKey, token);
                document.getElementById('authForms').innerHTML = "";

                if (await userAuthentication(token)) {
                    await performOperations();
                }
            }
        } else if (response.status == 401) {
            alert(data.ResponseMessage);
        } else {
            alert (data.Error)
        }
    } catch (error) {
        console.log(error);
    }
}

function getLoginFormData() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    return {
        "Username": username,
        "Password": password
    }
}

async function userAuthentication(token) {
    try {
        // console.log("Token: ", token);
        const response = await fetch(`http://localhost:3000/api/user/accountVerfication`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status == 200) {
            const data = await response.json();
            // console.log(data);
            if (data.Status == true) {
                return true;
            }
        } else if (response.status == 401) {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function showAllCerts(token) {
    const response = await fetch(`http://localhost:3000/api/${"UserAuth"}/certs`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (response.status == 200) {
        if (data.Status) {
            let certs = data.Certificates;
            document.getElementById("certVault").innerHTML = getCertsTable(certs);
        }
    } else if (response.status == 400) {
        console.log(data);
    } else if (response.status == 500) {
        console.log(data);
    }
}

function getCertsTable(jsonData) {
    let columnNames = { "CertName": 'Certificate Name', "OrganizationName": 'Organization Name', "IssueDate": 'Date of Issue', "ExpireDate": 'Expiry date', "CredentialID": 'Credential ID', "CredentialURL": 'Credential URL' };
    let certsTable = `<table id='certs'>`;
    for (let item of jsonData) {
        certsTable +=
            `<tr><td><table>
                <tr>
                    <td colspan="2">
                        <button onclick="editCert(this)" style="float:right">Edit</button>
                        <button onclick="deleteCert(this)" style="float:right">Delete</button>
                    </td>    
                </tr>`;
        for (let key in item) {
            certsTable +=
                `<tr>
                <th>${columnNames[key]}</th>    
                <td>${item[key]}</td>    
            </tr>`;
        }
        certsTable += `</table></td></tr>`;
    }
    certsTable += `<tr>
    <td colspan="2"><center><button onclick="addCert()">Add certification</button></center><hr></td>
    </tr>
    </table>`;
    return certsTable;
}

async function addCert() {
    document.getElementById('certForm').innerHTML = await certForm("save");
}

async function certForm(operation) {
    let certInfo;
    try {
        const response = await fetch('http://localhost:3000/api/certs/certInfo');
        const data = await response.json();
        if (response.status == 200) {
            if (data.Status == true) {
                certInfo = data.CertificatesInfo;
            }
        } else {
            console.log(data);
        }
    } catch (error) {
        console.log(error)
    }
    let certificateOptions = "";
    if (certInfo) {
        for (let i = 0; i < certInfo.length; i++) {
            certificateOptions += `<option value="${certInfo[i].CertName}//${certInfo[i].OrganizationName}">${certInfo[i].CertName}//${certInfo[i].OrganizationName}</option>`;
        }
    }
    let form = `<button onclick="clearForm()" id="clearForm" style="float:right">&#10006;</button><form>
    Certificate: <select id="certificateName" name="certificateName" placeholder="Certificate Name">
        <option value="" selected disabled>Select Certificate</option>
        ${certificateOptions}
    </select><br>
    Date of Issue: <input type="date" id="issueDate" name="issueDate" placeholder="Issue Date"><br>
    Expiry Date: <input type="date" id="expiryDate" name="expiryDate" placeholder="Expiry Date"><br>
    Credential ID: <input type="text" id="credentialID" name="credentialID" placeholder="Credential ID"><br>
    Credential URL: <input type="url" id="credentialURL" name="credentialURL" placeholder="Credential URL"><br>
    <button type="button" onclick="${operation}Cert()">${operation}</button>
    </form>`;

    return form;
}
async function saveCert() {
    const payloadData = getCertFormData();
    try {
        const response = await fetch(`http://localhost:3000/api/user/certs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadData)
        });

        const data = await response.json();
        if (response.status == 200) {
            alert(data.ResponseMessage);
            document.getElementById('certForm').innerHTML = "";
            await showAllCerts(token);
        } else if (response.status == 400) {
            alert(data.ResponseMessage);
            console.log(data);
        } else if (response.status == 500) {
            console.log(data);
            alert(data.Error);
        }
    } catch (error) {
        console.log(error);
    }
}

function getCertFormData() {
    let certName = document.getElementById('certificateName').value;
    const orgName = certName.split('//')[1];
    certName = certName.split('//')[0];
    const issueDate = document.getElementById('issueDate').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const credentialID = document.getElementById('credentialID').value;
    const credentialURL = document.getElementById('credentialURL').value;

    return {
        "Certificate":
        {
            "CertName": certName,
            "OrganizationName": orgName,
            "IssueDate": issueDate,
            "ExpireDate": expiryDate,
            "CredentialID": credentialID,
            "CredentialURL": credentialURL
        }
    };
}

async function performOperations() {
    document.getElementById('menuBar').innerHTML = "";
    createLogoutButton();
    await showAllCerts(token);
}

async function editCert(button) {
    document.getElementById('certForm').innerHTML = await certForm('update');
    let table = button.parentNode.parentNode.parentNode;
    let dataRow = table.rows[1];

    let certificateNameCell = dataRow.cells[1].innerHTML.trim();
    dataRow = table.rows[2];
    let organizationName = dataRow.cells[1].innerHTML.trim();

    let certificateName = certificateNameCell + '//' + organizationName;
    let selectElement = document.getElementById('certificateName');
    let optionValueToSelect = certificateName;

    for (let option of selectElement.options) {
        if (option.value === optionValueToSelect) {
            option.selected = true;
            break;
        }
    }
    selectElement.disabled = true;
    dataRow = table.rows[3];
    document.getElementById('issueDate').value = dataRow.cells[1].innerHTML.trim();
    dataRow = table.rows[4];
    document.getElementById('expiryDate').value = dataRow.cells[1].innerHTML.trim();
    dataRow = table.rows[5];
    document.getElementById('credentialID').value = dataRow.cells[1].innerHTML.trim();
    dataRow = table.rows[6];
    document.getElementById('credentialURL').value = dataRow.cells[1].innerHTML.trim();
}

async function updateCert() {
    const payloadData = getCertFormData();
    try {
        const response = await fetch(`http://localhost:3000/api/user/certs`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadData)
        });
        const data = await response.json();
        if (response.status == 200) {
            if (data.Status == true) {
                alert(data.ResponseMessage);
                document.getElementById('certForm').innerHTML = "";
                await showAllCerts(token);
            }
        } else if (response.status == 400) {
            alert(data.ResponseMessage);
        } else if (response.status == 500) {
            alert(data.Error);
        }
    } catch (error) {
        console.log(error);
    }
}

function clearForm() {
    document.getElementById('certForm').innerHTML = "";
}

async function deleteCert(button) {
    let table = button.parentNode.parentNode.parentNode;
    let dataRow = table.rows[1];

    let certificateName = dataRow.cells[1].innerHTML.trim();
    dataRow = table.rows[2];
    let organizationName = dataRow.cells[1].innerHTML.trim();

    if (confirm(`Are you sure you want to delete the ${certificateName}?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/user/certs?CertName=${certificateName}&OrganizationName=${organizationName}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.status == 200) {
                if (data.Status == true) {
                    alert(data.ResponseMessage);
                    document.getElementById('certForm').innerHTML = "";
                    await showAllCerts(token);
                }
            } else if (response.status == 404) {
                alert(data.ResponseMessage);
            } else if (response.status == 500) {
                alert(data.Error);
            }
        } catch (error) {
            console.log(error);
        }

    } else {
        alert("Deletion cancelled");
    }
}

function createLogoutButton() {
    const logoutButton = document.createElement('button');
    logoutButton.innerHTML = "Logout";
    logoutButton.style.float = "right";
    logoutButton.style.top = "1px";
    logoutButton.onclick = () => {
        logout(employeeCertTokenKey);
    };
    document.getElementById('menuBar').appendChild(logoutButton);
}

async function logout(tokenKey) {
    if (confirm("Do you want to logout?")) {
        localStorage.removeItem(tokenKey);
        alert("Logged out");
        createLoginSignupButtons();
        location.reload();
    } else {
        alert("Cancelled");
    }
}
