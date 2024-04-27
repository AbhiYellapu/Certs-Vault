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
      "Status": true,
      "Count": "No of certs"
    }
  ```
- Error: 
  ```json
    {
      "ResponseMessage": "Oops! Please try again later.", 
      "Status": false
    }
  ```
**Response Code:**  
- Success: 200  
- Error: 500  

### 2. Edit Cert:
**Method:** POST  
**Endpoint:** `/api/:empID/certs`  
**Query params:** `?CertID=xxx`  
**Payload:**  
- Edited Cert data in the form of Json eg: 
  ```json 
        {
            "Certficate": 
            {
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
            "ResponseMessage": "Certificate edited successfully",
            "Status": true,
            "EditedCertficate": 
            {
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
            "ResponseMessage": "message",
            "Status": false,
            "Error": "(Cause of the error)"
        }
  ```  
**Response Code:**  
- Success: 200  
- Error: 500/400  

### 3. Delete Cert:
**Method:** DELETE  
**Endpoint:** `/api/me/certs`  
**Query params:** `?CertID=xxx`  
**Payload:** -  
**Response Json:**  
- Success: 
    ```json
        {
            "ResponseMessage": "Certificate deleted successfully",
            "Status": true,
            "DeletedCertificate": 
            {
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
            "Response message": "Message",
            "Status": false
            "Error": "Cause of the error"
        }
    ```    
**Response Code:**  
- Success: 200  
- Error: 500/400  

### 4. Insert Cert:
**Method:** PUT  
**Endpoint:** `/api/:empID/certs`  
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
            "ResponseMessage": "Certificate inserted successfully",
            "Status": true,
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
            "Response message": "Message",
            "Status": false,
            "Error": "(Cause of the error)"
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
          "Status": true
        }

       Appropriate response will be generated based on the search option.  
                                  (or) 

        {
            "Response message": "No such Certificate found", 
            "Status": false
        }
  ```  
- Error: 
  ```json 
        {
            "Response message": "Oops! Please try again later.", 
            "Error": "(Cause of the error)",
            "Status": false
        }
  ```  
**Response Code:**  
- Success: 200  
- Error: 500, 404  
