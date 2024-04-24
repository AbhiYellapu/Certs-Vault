### 1. List Cert:
- **Method:** GET
- **Endpoint:** /api/me/certs
- **Query params:** ?EmployeeID=xxxx&sort=(DateOfIssue/ExpireDate/Asc/Desc)
- **Payload:** -
- **Response Json:** 
    - Success: `{"Certificates": [{"CertID": "Certificate ID", "CertName": "Name of the Certificate", "OrganizationName": "Name of the Organization","DateOfIssue": "dd/mm/yyyy", "ExpireDate": "dd/mm/yyyy"}, {}, {},..]} or {"Certificates": "No Certificates found"}`
    - Error: `{"error": "Oops! Please try again later."}`
- **Response Code:**
    - Success: 200
    - Error: 500

### 2. Update Cert:
- **Method:** PUT or PATCH
- **Endpoint:** /api/me/certs/updatecert
- **Query params:** ?CertID=xxx
- **Payload:** Updated Cert data eg: `{"CertName": "Name of the Certificate", "OrganizationName": "Name of the Organization","DateOfIssue": "dd/mm/yyyy", "ExpireDate": "dd/mm/yyyy"}`
- **Response Json:**
    - Success: `{"message": "Certificate updated successfully"}`
    - Error: `{"error": "Oops! Please try again later."}`
- **Response Code:**
    - Success: 200
    - Error: 500

### 3. Delete Cert:
- **Method:** DELETE
- **Endpoint:** /api/me/certs/deleteCert
- **Query params:** ?CertID=xxx
- **Payload:** -
- **Response Json:** 
    - Success: `{"message": "Certificate deleted successfully"}`
    - Error: `{"error": "Oops! Please try again later."}`
- **Response Code:**
    - Success: 200
    - Error: 500

### 4. Insert Cert:
- **Method:** POST
- **Endpoint:** /api/me/insertCert
- **Query params:** ?EmployeeID=xxxx
- **Payload:** `{"CertID": "Certificate ID", "CertName": "Name of the Certificate", "OrganizationName": "Name of the Organization","DateOfIssue": "dd/mm/yyyy", "ExpireDate": "dd/mm/yyyy"}`
- **Response Json:**
    - Success: `{"message": "{"field": "data", ..}"}`
    - Error: `{"error": "Cause of the error"}`
- **Response Code:**
    - Success: 200
    - Error status code eg: (400, 500, etc.)

### 5. Search Cert:
- **Method:** GET 
- **Endpoint:** /api/me/certs
- **Query params:** ?EmployeeID=xxxx&(CertID=xxx / CertName=xxx / OrganizationName=xxx)
- **Payload:** -
- **Response Json:** 
    - Success: `{"Certificate": {"CertName": "Name of the Certificate", "OrganizationName": "Name of the Organization","DateOfIssue": "dd/mm/yyyy", "ExpireDate": "dd/mm/yyyy"}}`
       Appropriate response will be generated based on the search option.
       (or) `{"message": "No such Certificate found"}`
    - Error: `{"error": "Oops! Please try again later."}`
- **Response Code:**
    - Success: 200
    - Error: 500
