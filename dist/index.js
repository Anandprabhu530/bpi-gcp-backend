"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pubsub_1 = require("@google-cloud/pubsub");
const storage_1 = require("./storage");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pubSubClient = new pubsub_1.PubSub();
const triggerPaymentCompletion = "payment-completed";
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    let data;
    const pubSubMessage = req.body.message;
    const requestData = Buffer.from(pubSubMessage.data, "base64")
        .toString()
        .trim();
    data = JSON.parse(requestData);
    const { senderId, receiverId, transactionId, amount } = data;
    yield (0, storage_1.transferBalance)(senderId, receiverId, amount);
    yield (0, storage_1.setstatus)(senderId, "transfered", 200, transactionId, true);
    yield (0, storage_1.setstatus)(receiverId, "transfered", 200, transactionId, false);
    const dataToPush = JSON.stringify({
        transactionId: transactionId,
        statusCode: 200,
        errorCode: 0,
    });
    const topic = pubSubClient.topic(triggerPaymentCompletion);
    const pubSubData = Buffer.from(dataToPush);
    try {
        const message = topic.publishMessage({ data: pubSubData });
        console.log(message);
    }
    catch (err) {
        console.log(err);
        return res.status(200).send();
    }
    return res.status(200).send();
}));
app.listen(8080, () => {
    console.log("Listening on port 8080");
});
