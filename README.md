
#### Imagine we are making a private messaging service for our new company Perry’s Summer Vacation Goods and Services. We need you to create an automated test script that verifies the **Message API**, not User API. 
### Requirements of Perry’s Summer Vacation Goods and Services.
####   Develop a scalable API to be able to handle the many messages this company is going to handle

* The application should be a REST API (No need for any kind of UI)
* The application should be ready to run in the cloud or in a container.
* The application data must be persisted in a database of some type.

* The application must be able to create and get users.
	* We do not expect you do handle any kind of authentication for users.
* The application must allow users to send a message to one other user.
	* No need to consider group chats.
* The application must allow editing and deleting messages.
* The application must be able to get all the messages sent between two users.

#### APIs your developer created:
**User Model**
```
{
    "name": "first last",
    "id": "uuid-of-user"
}
```
* POST /users   
    * Create a user
* GET /users
    * list all users
* GET /users/:id
    * Get a user by id
* PUT /users/:id
    * Update a user by id
* DELETE /users/:id
    * Delete a user by id

**Message Model**
```
{
    "from": {
        "id": "fromUserId"
    },
    "to": {
        "id": "toUserId"
    },
    "message": "text content of the message",
    "id": "uuid-of-message",
    "time": "2021-03-04T00:54:30.288Z"
}
```

* POST /message  
    * Create a message
* GET /message?from=fromUserId&to=toUserId
    * Get all the messages sent between two users.
* GET /message/:id
    * Get a message by id
* PUT /message/:id
    * Update a message by id
* DELETE /message/:id
    * Delete a message by id

#### The developer has provided some information that might helpful
* Postman collection [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11432960-97511c69-526e-4650-8626-6a939d59a17d)
* There's no pre-existing data in the application, you need to create users and messages using the provided requests.

#### How to run the service locally
* Node.js must be installed on your machine.
* Clone the repository to your computer.
* Navigate to the repository in a terminal and run the following commands, in order: ```npm install```, ```npm run-script build```, ```npm start```
* The service will now be running locally and you can access the endpoints at ```http://localhost:3000```

#### Technical requirements for your test script:
* Test the **Message API** to see if it meets the requirements.
    * You do not need to test the User API
* Your test script needs to be automated
* We do not expect that you spend more than 8 hours on this challenge.
* Use what language and testing framework you are comfortable with, such as JUnit or Jest.
* The source code must be shared in a public repository (Github, Bitbucket, etc).
* Write a README file on how to run you test script and a brief description of what you've tested (and any bugs you find).