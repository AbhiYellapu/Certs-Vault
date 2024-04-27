### 1. List Cert:

**Method:** GET  
**Endpoint:** `/api/:empID/certs`  
**Query params:** `?sortOption=(CertName/OrganizationName/DateOfIssue/ExpireDate)&sortBy=(Asc/Desc)`  
**Payload:** -  
**Response Json:**  
- Success: 
  ```json
    {
      "Certficates": 
        [
            {
                "CertID": "Certificate ID", 
                "CertName": "Name of the Certificate", 
                "OrganizationName": "Name of the Organization", 
                "DateOfIssue": "dd/mm/yyyy", 
                "ExpireDate": "dd/mm/yyyy", 
                "CerdentialID": "ABCDEFX..", 
                "CredentialURL": "http://Cert.com/Certs/:CredentialID"
            }, 
            {}, ....
            {}
        ], 
      "Response code": 200
    }
  ```
- Error: 
  ```json
    {
      "Response message": "Oops! Please try again later.", 
      "Response code": 500
    }
  ```
**Response Code:**  
- Success: 200  
- Error: 500  

### 2. Edit Cert:
**Method:** POST  
**Endpoint:** `/api/:empID/certs/editcert`  
**Query params:** `?CertID=xxx`  
**Payload:**  
- Edited Cert data in the form of Json eg: 
  ```json 
        {
            "Certficate": 
            {
                "CertID": "Certificate ID", 
                "CertName": "Name of the Certificate", 
                "OrganizationName": "Name of the Organization", 
                "DateOfIssue": "dd/mm/yyyy", 
                "ExpireDate": "dd/mm/yyyy", 
                "CerdentialID": "ABCDEFX..", 
                "CredentialURL": "http://Cert.com/Certs/:CredentialID"
            }
        }
  ```
**Response Json:**  
- Success: 
  ```json 
       {
            "Status": 
            "Certificate edited successfully",
            "EditedCertficate": 
            {
                "CertID": "Certificate ID", 
                "CertName": "Name of the Certificate", 
                "OrganizationName": "Name of the Organization", 
                "DateOfIssue": "dd/mm/yyyy", 
                "ExpireDate": "dd/mm/yyyy", 
                "CerdentialID": "ABCDEFX..", 
                "CredentialURL": "http://Cert.com/Certs/:CredentialID"
            }

       }
  ```  
- Error: 
  ```json 
        {
            "Response message": 
            "Oops! Please try again later.", 
            "Error": 
            "(Cause of the error)"
        }
  ```  
**Response Code:**  
- Success: 200  
- Error: 500  

### 3. Delete Cert:
**Method:** DELETE  
**Endpoint:** `/api/me/certs`  
**Query params:** `?CertID=xxx`  
**Payload:** -  
**Response Json:**  
- Success: 
    ```json
        {
            "Status": 
            "Certificate deleted successfully", 
            "DeletedCertificate": 
            {
                "CertID": "Certificate ID", 
                "CertName": "Name of the Certificate", 
                "OrganizationName": "Name of the Organization", 
                "DateOfIssue": "dd/mm/yyyy", 
                "ExpireDate": "dd/mm/yyyy", 
                "CerdentialID": "ABCDEFX..", 
                "CredentialURL": "http://Cert.com/Certs/:CredentialID"
            }            
        }
    ```  
- Error: 
    ```json
        {
            "Response message": 
            "Oops! Please try again later.", 
            "Error": 
            "Cause of the error"
        }
    ```    
**Response Code:**  
- Success: 200  
- Error: 500  

### 4. Insert Cert:
**Method:** PUT  
**Endpoint:** `/api/:empID/insertCert`  
**Query params:** -  
**Payload:**  
- Certificate data in the form of Json  
  ```json 
        {
            "Certficate": 
            {
                "CertID": "Certificate ID", 
                "CertName": "Name of the Certificate", 
                "OrganizationName": "Name of the Organization", 
                "DateOfIssue": "dd/mm/yyyy", 
                "ExpireDate": "dd/mm/yyyy", 
                "CerdentialID": "ABCDEFX..", 
                "CredentialURL": "http://Cert.com/Certs/:CredentialID"
            }
        }
  ```
**Response Json:**  
- Success: 
  ```json 
       {
            "Status": 
            "Certificate inserted successfully",
            "InsertedCertficate": 
            {
                "CertID": "Certificate ID", 
                "CertName": "Name of the Certificate", 
                "OrganizationName": "Name of the Organization", 
                "DateOfIssue": "dd/mm/yyyy", 
                "ExpireDate": "dd/mm/yyyy", 
                "CerdentialID": "ABCDEFX..", 
                "CredentialURL": "http://Cert.com/Certs/:CredentialID"
            }

       }
  ```  
- Error: 
  ```json 
        {
            "Response message": 
            "Oops! Please try again later.", 
            "Error": 
            "(Cause of the error)"
        }
  ```  
**Response Code:**  
- Success: 200  
- Error status code eg: (500)  

### 5. Search Cert:
**Method:** GET   
**Endpoint:** `/api/:empID/certs/searchCert`  
**Query params:** `?(CertName=xxx / OrganizationName=xxx/...)`  
**Payload:** -  
**Response Json:**  
- Success: 
  ```json
        {
          "Certficates": 
            [
                {
                    "CertID": "Certificate ID", 
                    "CertName": "Name of the Certificate", 
                    "OrganizationName": "Name of the Organization", 
                    "DateOfIssue": "dd/mm/yyyy", 
                    "ExpireDate": "dd/mm/yyyy", 
                    "CerdentialID": "ABCDEFX..", 
                    "CredentialURL": "http://Cert.com/Certs/:CredentialID"
                }, 
                {}, ....
                {}
            ], 
          "Response code": 200
        }

       Appropriate response will be generated based on the search option.  
                                  (or) 

        {
            "Response message": 
            "No such Certificate found", 
            "Status": 
            404
        }
  ```  
- Error: 
  ```json 
        {
            "Response message": 
            "Oops! Please try again later.", 
            "Error": 
            "(Cause of the error)"
        }
  ```  
**Response Code:**  
- Success: 200  
- Error: 500, 404  
