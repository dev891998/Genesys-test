const request = require('supertest');
const baseURL = "http://localhost:3000/api";

var messageId;
let user1 = "5145093c-16f7-46c1-993e-76c7330cbf00";
let user2 = "900bfbd1-313b-4c48-be9e-73f157f5bac6";

describe('Message API Tests', () => {

    // Test for creating a message
    it('should create a new message', async () => {
        const response = await request(baseURL)
            .post('/messages')
            .send({
                from: { id: user1 },
                to: { id: user2 },
                message: "Hello, this is a test message!",
                time: new Date().toISOString()
            });
        console.log('Request Data:', response);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        messageId = response.body.id;  // Save messageId for further tests
    });

    // Test for getting a message by id
    it('should get a message by id', async () => {
        const response = await request(baseURL).get(`/messages/${messageId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', messageId);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('from.id', user1);
        expect(response.body).toHaveProperty('to.id', user2);
    });

    // Test for getting all messages between two users
    it('should get all messages between two users', async () => {
        const response = await request(baseURL)
            .get('/messages')
            .query({ from: user1, to: user2 });

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((message) => {
            expect(message).toHaveProperty('from.id', user1);
            expect(message).toHaveProperty('to.id', user2);
            expect(message).toHaveProperty('message');
            expect(message).toHaveProperty('id');
            expect(message).toHaveProperty('time');
        });
    });

    it('when message id does not exist ', async () => {
        const response = await request(baseURL)
            .get(`/messages/abcd`)
        console.log('Request Data:', response);

        expect(response.status).toBe(404);
        if (response.body === "") {
            expect(response.body).toBe(""); // Check if the response body is an empty string
        } else {
            expect(response.body).toBeTruthy(); // Check if the response body exists
            expect(Object.keys(response.body).length).toBeGreaterThan(0); // Check if the response body is not empty
            expect(response.body).toHaveProperty('id'); // Check if the response body has property 'id'
        }
    });

    it('when trying to get all messages between two users using non existing user ids', async () => {
        const response = await request(baseURL)
            .get('/messages')
            .query({ from: "dd", to: "dd" });
        console.log('Request Data:', response);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toEqual([]);
        expect(response.body.length).toBe(0);
    });

    it('when message not passed in the body', async () => {
        const response = await request(baseURL)
            .post('/messages')
            .send({
                from: { id: user1 },
                to: { id: user2 },
                time: new Date().toISOString()
            });
        console.log('Request Data:', response);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('name', 'ServiceError');
        expect(response.body.error).toHaveProperty('message', "should have required property 'message'");
        expect(response.body.error).toHaveProperty('code', 400);
    });

    it('when message is an empty string', async () => {
        const response = await request(baseURL)
            .post('/messages')
            .send({
                from: { id: user1 },
                to: { id: user2 },
                message: "",
                time: new Date().toISOString()
            });
        console.log('Request Data:', response);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        messageId = response.body.id;
    });

    it('when message is passed without to property', async () => {
        const response = await request(baseURL)
            .post('/messages')
            .send({
                from: { id: user1 },
                message: "Test message",
                time: new Date().toISOString()
            });
        console.log('Request Data:', response);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('name', 'ServiceError');
        expect(response.body.error).toHaveProperty('message', "should have required property 'to'");
        expect(response.body.error).toHaveProperty('code', 400);
    });

    it('when message is passed without from property', async () => {
        const response = await request(baseURL)
            .post('/messages')
            .send({
                to: { id: user2 },
                message: "Test message",
                time: new Date().toISOString()
            });
        console.log('Request Data:', response);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('name', 'ServiceError');
        expect(response.body.error).toHaveProperty('message', "should have required property 'from'");
        expect(response.body.error).toHaveProperty('code', 400);
    });

    it('when message is passed without to,from & message properties', async () => {
        const response = await request(baseURL)
            .post('/messages')
            .send({
            });
        console.log('Request Data:', response);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('name', 'ServiceError');
        expect(response.body.error).toHaveProperty('message', "should have required property 'from'");
        expect(response.body.error).toHaveProperty('code', 400);
    });

    it('when from & to properties are not passed to get the list of messages between two users',
        async () => {
        const response = await request(baseURL).get('/messages')

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((message) => {
            expect(message).toHaveProperty('from.id');
            expect(message).toHaveProperty('to.id');
            expect(message).toHaveProperty('message');
            expect(message).toHaveProperty('id');
            expect(message).toHaveProperty('time');
        });
    });

    it('when trying to get all messages between two users using from property only', async () => {
        const response = await request(baseURL)
            .get('/messages')
            .query({ from: "yyy" });
        console.log('Request Data:', response);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toEqual([]);
        expect(response.body.length).toBe(0);
    });

    it('when trying to get all messages between two users using to property only', async () => {
        const response = await request(baseURL)
            .get('/messages')
            .query({ to: "zzz" });
        console.log('Request Data:', response);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toEqual([]);
        expect(response.body.length).toBe(0);
    });

    it('should get a message by id', async () => {
        const response = await request(baseURL).get(`/messages`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((message) => {
            expect(message).toHaveProperty('from.id');
            expect(message).toHaveProperty('to.id');
            expect(message).toHaveProperty('message');
            expect(message).toHaveProperty('id');
            expect(message).toHaveProperty('time');
        });
    });

    it('when trying to delete a message without passing messageId', async () => {
        const response = await request(baseURL).delete(`/messages`);
        console.log('Request Data:', response);

        expect(response.status).toBe(404);
    });

    it('should delete a message by id', async () => {
        const response = await request(baseURL).delete(`/messages/${messageId}`);

        expect(response.status).toBe(204);
    });

    it('when trying to delete a message by sending invalid messageId', async () => {
        const response = await request(baseURL).delete(`/messages/messageId`);
        console.log('Request Data:', response);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('name', 'ServiceError');
        expect(response.body.error).toHaveProperty('message', 'message not found');
        expect(response.body.error).toHaveProperty('code', 404);
    });

});

