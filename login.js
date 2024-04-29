// Authentication using token based approach

import express from 'express'
import { connectToDatabase } from './dbconnection.js'
import jwt from 'jsonwebtoken';

const app = express();
const port = 3001;

app.use(express.json());

const db = await connectToDatabase();

app.post('/api/login', async function (request, response) {
    let username = request.body.Username;
    let password = request.body.Password;
    let token;
    let existingUser = await getUserDetails(username);
    if (!existingUser || existingUser.Password != password) {
        response.status(401).send({ ResponseMessage: "Invalid username and password" });
    } else {
        try {
            token = jwt.sign({ EmployeeID: existingUser.EmployeeID }, "empID", { expiresIn: "1d" });
            response.status(200).send({ Status: true, Data: { EmployeeID: existingUser.EmployeeID, Username: existingUser.Username, token: token } })
        } catch (error) {
            response.send({ error: "Oops, something went wrong!" });
            console.log(error);
        }
    }
});

app.post('/api/signup', async function (request, response) {

});

app.get('/api/accessToken', function (request, response) {
    try {
        const token = request.headers.authorization.split(' ')[1];
        if (!token) {
            response.status(200).send({ Success: false, ResponseMessage: "Error!Token was not provided." });
        }
        const decodedToken = jwt.verify(token, "empID");
        console.log(decodedToken);
        response.status(200).send({ Success: true, Data: { EmployeeID: decodedToken.EmployeeID } });
    } catch (error) {
        response.send(error);
    }
});

app.listen(port, function () {
    console.log(`Server is running on port: ${port}.`);
})

async function getUserDetails(username) {
    let existingUser;
    try {
        existingUser = await db.get("SELECT * FROM User WHERE Username = ?", username);
        console.log(existingUser);
    } catch (error) {
        console.log(error);
    }
    return existingUser;
}
