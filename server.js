const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

// Replace these placeholders with your actual URLs and token
const pickyAssistConnectorUrl = "https://pickyassist.com/app/url/82c49d7ae920ba2b483cc180adda1b489fda1cd9";
const pushApiUrl = "https://pickyassist.com/app/api/v2/push";
const token = "50355d50467495db3b12ea84630ce6286d06caab"; // Replace with your actual token

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to handle incoming webhook events
app.post("/", async (req, res) => {
    try {
        const requestBodyString = Object.keys(req.body)[0];
        const webhookEvent = JSON.parse(requestBodyString);
        console.log("webhook event",webhookEvent)
        if (!webhookEvent || !webhookEvent.message || !webhookEvent.number) {
            throw new Error("Invalid webhook event data");
        }
        await handleWebhookEvent(webhookEvent, res); // Pass 'res' to handle the response
    } catch (error) {
        console.error("Error handling webhook event:", error.message);
        res.status(500).send("Internal Server Error"); // Send error response
    }
});

// Function to handle incoming webhook events
async function handleWebhookEvent(event, res) { // Add 'res' parameter
    try {
        console.log("handleevent")
        const message = event.message.toLowerCase().replace(/"/g, ''); // Remove double quotes
        const number = event.number.replace(/"/g, ''); // Remove double quotes

        // Determine the action based on the message
        switch (message) {
            case "balance":
                console.log("inside balance switch")
                await handleBalance(number, res); // Pass 'res' to handle the response
                break;
            case "wish":
                console.log("Inside wish switch")
                await handleWish(number, res); // Pass 'res' to handle the response
                break;
            default:
                console.log("No matching action found for message:", message);
                res.sendStatus(200); // Send success response if no matching action
                break;
        }
    } catch (error) {
        console.log("error!", error)
        console.error("Error handling webhook event:", error.message);
        throw error;
    }
}

// Function to handle balance request
async function handleBalance(number, res) { // Add 'res' parameter
    console.log("Handling balance request...");
    const responseMessage = "Your balance is $100.";
    await sendResponseToUser(number, responseMessage);
    return res.json({"Balance Inquiry":"Done"}); // Send response
}

// Function to handle wish request
async function handleWish(number, res) { // Add 'res' parameter
    console.log("Handling wish request...");
    const responseMessage = "Happy Diwali!";
    await sendResponseToUser(number, responseMessage);
    return res.json({"Wishing":"Done"}); // Send response
}

// Function to send message to sendResponseTOUser
async function sendResponseToUser(userNumber, message) {
    try {
        console.log("Sending response to user:", message);
        //message="Hello chatBot";
        const pushMessage = {
            token,
            application: 10, // WhatsApp Web Automation
            data: [{
                number: userNumber,
                message
            }]
        };
        const pushApiResponse = await axios.post(pushApiUrl, pushMessage);
        console.log("Response sent to user successfully using Push API:", pushApiResponse.data);
    } catch (error) {
        console.error("Error sending response to user using Push API:", error.message);
        throw error;
    }
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
