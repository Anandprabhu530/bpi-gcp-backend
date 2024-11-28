import express from "express";
import {setstatus, transferBalance} from "./storage";

const app = express();

app.use(express.json());

app.post("/", async (req, res) => {
  if (!req.body) {
    const msg = "no Pub/Sub message received";
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  if (!req.body.message) {
    const msg = "invalid Pub/Sub message format";
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }

  let data: any;
  const pubSubMessage = req.body.message;
  const requestData = Buffer.from(pubSubMessage.data, "base64")
    .toString()
    .trim();
  data = JSON.parse(requestData);

  const {senderId, receiverId, transactionId, amount} = data;
  try {
    await transferBalance(senderId, receiverId, amount);
    await setstatus(
      senderId,
      receiverId,
      "transfered",
      0,
      transactionId,
      amount,
      true
    );
    await setstatus(
      receiverId,
      senderId,
      "transfered",
      0,
      transactionId,
      amount,
      false
    );
    console.log(`Payment completed - ${transactionId}`);
    return res.status(200).send();
  } catch (error) {
    console.log(`An Error occured - ${error}`);
    return res.status(200).send();
  }
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
