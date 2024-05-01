// Cert Vault operations

let token;
const employeeCertTokenKey = "EmployeeJwtKey";

window.onload = async function () {
    token = localStorage.getItem(employeeCertTokenKey);
    let isValidToken = await userAuthentication(token)
    console.log(isValidToken);
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
    <input type="text" placeholder="Username" name="username" id="username">
    <input type="password" placeholder="Password" name="password" id="password">
    <button type="button" onclick= "login()">Login</button>
    </form>`;
    document.getElementById("authForms").innerHTML = loginForm;
}

function createRegisterForm() {
    var registerForm = `<form id="registerForm">
        <input type="text" placeholder="Employee Name" id="employeeName" required>
        <input type="date" placeholder="DOB" id="dob">
        <input type="email" placeholder="Email" id="email" required>
        <input type="tel" placeholder="Mobile Number" id="mobileNumber" required>
        <input type="text" placeholder="Username" name="username" id="username" required>
        <input type="password" placeholder="Password" name="password" id="password" required>
        <button type="button" onclick="register()">Register</button>
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
        if (data.Status == true) {
            alert("Registered successfully!");
            document.getElementById('authForms').innerHTML = "";
            createLoginSignupButtons();
        } else {
            alert(`Failed to register. ${data.Data}`);
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
        if (data.Status == true) {
            token = data.Data.Token;
            localStorage.setItem(employeeCertTokenKey, token);
            document.getElementById('authForms').innerHTML = "";

            if (await userAuthentication(token)) {
                await performOperations();
            }
        } else {
            alert("Invalid username or password");
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
        console.log("Token: ", token);
        const response = await fetch(`http://localhost:3000/api/user/accountVerfication`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status == 200) {
            const data = await response.json();
            console.log(data);
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
            document.getElementById("certVault").innerHTML = getOrderedCertList(certs);
            console.log(certs);
        }
    } else if (response.status == 401) {
        console.log(data);
    }
}

function getOrderedCertList(jsonData) {
    let orderedList = `<table id='certs'>`;
    for (let item of jsonData) {
        orderedList +=
            `<tr>
            <table>
                <tr>
                    <td>
                        <button onclick="edit(this)">Edit</button>
                    </td>    
                    <td>
                        <button onclick="delete(this)">delete</button>
                    </td>    
            </tr>`;
        for (let key in item) {
            orderedList +=
                `<tr>
                <th>
                    ${key}
                </th>    
                <td>
                    ${item[key]}
                </td>    
            </tr>`;
        }
        orderedList += `</table>
                        </tr>`;
    }
    orderedList += `</table>`;
    return orderedList;
}



async function addCert() {
    let certTable = document.getElementById('addCertForm');
    let = inputPlaceholder = ['Certificate Name', 'Organization Name', 'Issue date', 'Expiry date', 'CredentialID', 'CredentialURL'];

}

async function performOperations() {
    document.getElementById('menuBar').innerHTML = "";
    createLogoutButton();
    await showAllCerts(token);
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

