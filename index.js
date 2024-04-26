const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { NlpManager } = require("node-nlp");
const fs = require('fs')

const app = express();
const port = 3000;

// Replace these placeholders with your actual URLs and token
const pickyAssistConnectorUrl = "https://pickyassist.com/app/url/82c49d7ae920ba2b483cc180adda1b489fda1cd9";
const pushApiUrl = "https://pickyassist.com/app/api/v2/push";
const token = "50355d50467495db3b12ea84630ce6286d06caab"; // Replace with your actual token


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.post("/", async (req, res) => {
    try {
        console.log("req body", req.body)
        // Extract the string from the request body
        const requestBodyString = Object.keys(req.body)[0];

        // Parse the string into a JSON object
        const requestData = JSON.parse(requestBodyString);

        // Extract necessary information from the parsed JSON object
        //const message = "Happy Diwali ";
        const number = requestData.number; // Placeholder for the number

        console.log("number:", number);
        await sendResponseToUser(number);
        console.log("Response Successfully Delivered")
        return res.json({ "Report file": "This is your file" });
        // Check if message and number are present in the request data
        // if (message && number) {
        //     // Your existing logic here
        //    // await sendMessageToPickyAssist(number, message);
        //     await sendResponseToUser(number, message);
        //     console.log("first time end")
        //     return res.json({ "Report file": "This is your file" });
        // } 
        // else {
        //    // console.error("Invalid message:", message);
        //     // Respond with an error
        //     res.status(407).json({
        //         success:false,
        //         info: "Unprocessable entity",
        //         message: "Message cannot be empty"
        //     })
        //     // throw new Error("Invalid message or number");
        // }
    } catch (error) {
        console.error("Error handling webhook event:", error.message);
        throw error;
    }
});



// Function to send message to Picky Assist
// async function sendMessageToPickyAssist(to, text) {
//     try {
//         const response = await axios.post(pickyAssistConnectorUrl, {
//             token,
//             application: 10, // WhatsApp Web Automation
//             data: [{
//                 number: to,
//                 message: text
//             }]
//         });
//         console.log("Message sent successfully to Picky Assist:", response.data);
//     } catch (error) {
//         console.error("Error sending message to Picky Assist:", error.message);
//         throw error;
//     }
// }

// Function to send response to user
async function sendResponseToUser(userNumber) {
    try {
        console.log("Sending response to user:");
        //message="Hello chatBot";
        const pushMessage = {
            token,
            priority: "0", // Priority level of the message
            application: "10", // Application ID
            "media_name": "image.jpg",
            "globalmessage": "Check out this amazing image!",
            "globalmedia": "https://www.cs.toronto.edu/~mashiyat/csc309/Lectures/javascript.pdf", // Unique URL of the media file
            data: [{
                number: userNumber,
                message: "This is your Report file",// Caption for the media
               // media: base64Media // Base64 encoded media file
            }]
        };

        const pushApiResponse = await axios.post(pushApiUrl, pushMessage);
        console.log("Response sent to user successfully using Push API:", pushApiResponse.data);
    } catch (error) {
        console.error("Error sending response to user using Push API:", error.message);
        throw error;
    }
}

// Route to handle incoming webhook events

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});