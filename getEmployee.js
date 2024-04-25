// Get all Employeee Details

// import { connectToDatabase } from "./dbconnection.js";

export async function getEmployeeDetails(db, employeeID) {
        let table = 'Employee';
        let query = `SELECT * FROM ${table} WHERE EmployeeID = ?;`
        return db.get(query, employeeID);
}
// const db = await connectToDatabase();
// const employee = await getEmployeeDetails(db, "E0001");
// console.log(employee);
