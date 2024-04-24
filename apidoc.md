1. List Cert:
    Method : GET 
    Endpoint : /api/me/certs 
    Query params :   ?EmployeeID=xxxx&sort=desc
    Payload : -
    Response Json : 
        - Success: {"Certificates": [{}, {},..etc]}
        - Error:
            - {"message": "No Certificates found"}
            - {"error": "Oops! Please try again later."}
    Response Code :
        - Success: 200
        - Error:
            - 404
            - 500

2. Edit Cert:
    Method : PUT or PATCH
    Endpoint : /api/me/Updatecert
    Query params :   ?CertID=xxx
    Payload : New Cert data
    Response Json :
        - Success: {"message": "Certificate updated successfully"}
        - Error: {"error": "Oops! Please try again later."}
    Response Code :
        - Success: 200
        - Error: 500

3. Delete Cert:
    Method : DELETE
    Endpoint : /api/me/DeleteCert
    Query params :   ?CertID=xxx
    Payload : -
    Response Json : 
        - Success: {"message": "Certificate deleted successfully"}
        - Error: {"error": "Oops! Please try again later."}
    Response Code :
        - Success: 200
        - Error: 500

4. Insert Cert:
    Method : Post
    Endpoint : /api/me/InsertCert
    Query params :   ?EmployeeID=xxxx
    Payload : {"CertID": "Certificate ID", "CertName": "Name of the Certificate", "OrganizationName": "Name of the Organization","DateOfIssue": "dd/mm/yyyy", "ExpireDate": "dd/mm/yyyy"}
    Response Json :
        - Success: {"message": "{"field": "data", ..}"}
        - Error: {"error": "Cause of the error"}
    Response Code :
        - Success: 200
        - Error status code eg: (400, 500, etc.)
