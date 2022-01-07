# IA-Question1
Level: Intermediate – Advanced 
Question 1 - 44h
Create a portal where the employees can post their resumes and apply for the available opening positions in the company. Also the project managers can add an opening for the project.
A position needs to have the following values:
•	Project Name – String - required
•	Client Name – String - required
•	Technologies – Array of string - required
•	Role – Enum – required
•	Job Description – String - required
•	Status (open/closed) – Bit – required
Status will determine if the position is visible to the employees of the company or not. A project manager will update the position state when the position is no longer available.
The portal will support 2 kinds of users:
1.	Project Managers
2.	Employees
If an employee is interested in a position, he/she can apply for the same.
For simplicity, the following needs to be implemented:
1.	Create a web server using express framework.
2.	Add the following users in the database: 
a.	Project Managers - Add 2 users in the database (Id, Name,UserName,Password, Role)
b.	Employees – Add 5 users in the database (Id, Name,UserName,Password, Role)
3.	Expose the following REST APIs. Make sure you use the correct HTTP verbs to implement the below APIs
•	See a list of available openings in the company
This API fetches the high level details of each opening (Project Name, Role, Technology) and returns them as a result.
•	Check the details of any opening (using a valid identifier)
This API fetches all the details relating to a specific opening. Return relevant status code for success and errors.
•	Apply for the opening
This API allows the employees to show interest in a specific opening. Apply with the help of a userId of an employee already present in the database. Save the entry in the database. Once applied, same user cannot apply again for the opening and relevant message should be displayed in the response.
When an employee applies for a position, a notification should be sent to the recruiter. To imitate an opening, you can imitate it by logging onto the console.  Explore custom events to print this notification. 
•	Add an opening
This API allows the recruiter to add a job opening. This should add an entry in database. Make sure to implement relevant validations to facilitate this change. In case of an invalid ID return relevant error code with description
•	Delete an opening
This API allows the recruiter to delete his/her added opening. This should delete an entry in the database.
•	Update an opening
This API allows the recruiter to update the opening, if the opening position is closed, a notification should be sent to the employee who has shown an interest. To imitate the update, you can imitate it by logging onto the console.  Explore custom events to print this notification.
•	Check Applications
This API will return the applicant information, return a list of userIds for the userIds which have applied.
•	Login
The user needs to login using a password and userId present in the database. The API should return a valid token on successful authentication which can be used for further requests.
•	Upload Resume
Create an API which allows a user to upload a resume (file) to the system. 
There can only 1 resume per employee. Any subsequent uploads should result in overwriting the previous resume files.
Any uploaded files shall go in a specified directory on the server and the entry for the corresponding user should go in the database.
•	Download Resume
Create an API which allows the logged in user to download his resume using his userId.
4.	Make use of middlewares for the below items
a.	Validations
b.	Errors
c.	Authorization
5.	Create an authentication mechanism using PassportJS and JWT strategy.
6.	Authorize the following APIs
a.	Create an Opening – Manager of the opening
b.	Delete an Opening – Manager of the opening
c.	Update an Opening – Manager of the opening
d.	Check Applications – Manager of the opening
e.	Apply for Opening – Any Employee 
f.	Available Openings – Employee + Manager (not open for all)
g.	Details of an opening -Employee + Manager (not open for all)
h.	Upload resume – Employee with current session
7.	Every API should return relevant status code and messages in both success and errors.
8.	Create a Unit Testing Framework using JEST (or any other framework of your choice) and testing the above mentioned APIs Create 2 tests per API (1 Positive + 1 Negative).
9.	Use best practices for code structuring.
10.	Use relevant schema in Mongo DB and host them over any free cloud service (e.g : https://mlab.com/) and specify the connection string in the solution.
