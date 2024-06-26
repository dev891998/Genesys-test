### Perry's Summer Vacation Goods and Services Message API Test Script
This repository contains an automated test script for verifying the Message API of Perry's Summer Vacation Goods and Services. The tests are written using Jest and Supertest frameworks.

### Prerequisites
Before running the test script, ensure you have the following installed on your machine:
```
	Node.js
	npm (Node Package Manager)
```

### Installation
Clone the repository to your local machine:
	git clone https://github.com/dev891998/Genesys-test.git

### Install the required dependencies:
	npm install -g ts-node 
	npm install --save-dev jest supertest

### Running the Service Locally
Ensure Node.js is installed on your machine. Navigate to the repository in a terminal and run the following commands, in order:
```
	npm install 
	npm run-script build 
	ts-node src/index.ts
```
The service will now be running locally, and you can access the endpoints at http://localhost:3000.

### Running the Tests
Ensure the service is running locally on http://localhost:3000. Execute the tests using the following command:
```
	npm test
```

### Test Cases
The following test cases are covered in the script:

Creating a Message: Verifies that a new message can be created successfully.

Getting a Message by ID: Verifies that a message can be retrieved by its ID.

Getting All Messages Between Two Users: Verifies that all messages sent between two users can be retrieved.

Getting a Non-Existent Message by ID: Verifies the response when trying to get a message with a non-existent ID.

Getting Messages with Non-Existent User IDs: Verifies the response when trying to get messages between non-existent users.

Creating a Message Without Message Content: Verifies the response when trying to create a message without the message field.

Creating a Message with Empty String Content: Verifies the response when trying to create a message with an empty string as the content.

Creating a Message Without 'To' Property: Verifies the response when trying to create a message without the to property.

Creating a Message Without 'From' Property: Verifies the response when trying to create a message without the from property.

Creating a Message Without 'From', 'To', and 'Message' Properties: Verifies the response when trying to create a message without from, to, and message properties.

Getting All Messages Without 'From' and 'To' Properties: Verifies the response when trying to get all messages without specifying from and to properties.

Getting Messages with 'From' Property Only: Verifies the response when getting messages using only the from property.

Getting Messages with 'To' Property Only: Verifies the response when getting messages using only the to property.

Deleting a Message by ID: Verifies that a message can be deleted by its ID.

Deleting a Message Without Passing Message ID: Verifies the response when trying to delete a message without passing a message ID.

Deleting a Message with Invalid Message ID: Verifies the response when trying to delete a message with an invalid message ID.

### Postman Collection
Two users have been created using Postman for testing purposes. The Postman collection can be imported and used to interact with the API endpoints.

### Additional Notes
The tests are located in the test folder. Ensure the service is running locally before executing the tests.
Updating the messages API did not work as expected in the given Postman collection
When message-id is not passed in the delete message API, it returns an error in the HTML format
