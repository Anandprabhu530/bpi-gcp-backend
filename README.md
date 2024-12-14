# BPI - (Basic Payment Interface)

I developed this project in order to mimic and understand the behavior of UPI system. Through out the project, I understood a how payments are generally processed in UPI with NPCI.

This repository consists of code related to backend which is hosted in cloud run by Google Cloud. I have containerized the appliction with docker and hosted it in cloud run.
I have also added Pub/Sub trigger to identify the status of a payment.

## Project Components:

- Backend Code: This code resides in a Google Cloud container and is responsible for processing payments.
- Docker Container: The application is containerized for easier deployment and scalability.
- Cloud Run: This Google Cloud service hosts the containerized application.
- Pub/Sub Trigger: This trigger in Google Cloud listens for messages related to payment status.
- Firebase Functions: These functions trigger the payment processing service and handle authentication ([Code can be found here](https://github.com/Anandprabhu530/bpi-firebase-functions))

## Installation:

```bash
git clone https://github.com/Anandprabhu530/bpi-gcp-backend.git
cd [your project directory]
npm install
```

## Required Libraries:

- Express.js (web framework)
- Firebase Admin SDK (for interacting with Firebase)

## How it Works:

A Firebase function publishes a message to a Pub/Sub topic.
The Cloud Run service consumes the message and processes the transaction.

Firebase functions verify the transaction's authenticity.
After successful processing, Cloud Run updates the transaction status in Firestore.

The frontend application retrieves the updated transaction status from Firestore.

### Potential Improvements:

Transaction Grouping: Implement functionality to group related transactions for easier management.

High Availability: Design the system for higher uptime and redundancy to minimize downtime.
