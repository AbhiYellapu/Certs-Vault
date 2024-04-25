### 1. List Certs:
**Method:** GET  
**Endpoint:** /api/me/certs  
**Query params:** ?EmployeeID=xxxx&sort=(DateOfIssue/ExpireDate/Asc/Desc)  
**Payload:** -  
**Response Json:**  
    - Success: `{"Response message": [{"CertID": "Certificate ID", "CertName": "Name of the Certificate", "OrganizationName": "Name of the Organization","DateOfIssue": "dd/mm/yyyy", "ExpireDate": "dd/mm/yyyy",..}, {}, {},..], "Response code": 200}` or `{"Response message": "No Certificates found", "Response code": 200/404}`  
    - Error: `{"Response message": "Oops! Please try again later.", "Response code": 500}`
**Response Code:**  
    - Success: 200  
    - Error: 500  

### 2. Update Cert:
**Method:** PUT or PATCH  
**Endpoint:** /api/me/certs/updatecert  
**Query params:** ?CertID=xxx  
**Payload:** Updated Cert data eg: `{"CertName": "Name of the Certificate", "OrganizationName": "Name of the Organization","DateOfIssue": "dd/mm/yyyy", "ExpireDate": "dd/mm/yyyy",..}`  
**Response Json:**  
    - Success: `{"Response message": "Certificate updated successfully", "Response code": 200}`  
    - Error: `{"Response message": "Oops! Please try again later.", "Response code": 500}`  
**Response Code:**  
    - Success: 200  
    - Error: 500  

### 3. Delete Cert:
**Method:** DELETE  
**Endpoint:** /api/me/certs/deleteCert  
**Query params:** ?CertID=xxx  
**Payload:** -  
**Response Json:**  
    - Success: `{"Response message": "Certificate deleted successfully", "Response code": 200}`  
    - Error: `{"Response message": "Oops! Please try again later.", "Response code": 500}`    
**Response Code:**  
    - Success: 200  
    - Error: 500  

### 4. Insert Cert:
**Method:** POST  
**Endpoint:** /api/me/insertCert  
**Query params:** ?EmployeeID=xxxx  
**Payload:** `{"CertID": "Certificate ID", "CertName": "Name of the Certificate", "OrganizationName": "Name of the Organization","DateOfIssue": "dd/mm/yyyy", "ExpireDate": "dd/mm/yyyy",..}`  
**Response Json:**  
    - Success: `{"Response message": "Certificate inserted successfully", "Response code": 200}`  
    - Error: `{"Response message": "Cause of the error", "Response code": (500)}`  
**Response Code:**  
    - Success: 200  
    - Error status code eg: (500)  

### 5. Search Cert:
**Method:** GET   
**Endpoint:** /api/me/certs  
**Query params:** ?EmployeeID=xxxx&(CertID=xxx / CertName=xxx / OrganizationName=xxx)  
**Payload:** -  
**Response Json:**  
    - Success: `{"Response message": {"CertName": "Name of the Certificate", "OrganizationName": "Name of the Organization","DateOfIssue": "dd/mm/yyyy", "ExpireDate": "dd/mm/yyyy",..}, "Response code": 200}`  
       Appropriate response will be generated based on the search option.  
       (or) `{"Response message": "No such Certificate found", "Response code": 200/404}`  
    - Error: `{"Response message": "Oops! Please try again later.", "Response code": 500}`    
**Response Code:**  
    - Success: 200  
    - Error: 500  
