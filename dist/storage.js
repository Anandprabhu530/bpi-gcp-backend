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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setstatus = exports.transferBalance = void 0;
const firebase_admin_1 = require("firebase-admin");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)({ credential: firebase_admin_1.credential.applicationDefault() });
const firestore = new firestore_1.Firestore();
const transferBalance = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield firestore.collection("account").doc(senderId).get();
    const response = res.data();
    yield firestore
        .collection("account")
        .doc(senderId)
        .set({ balance: (response === null || response === void 0 ? void 0 : response.balance) - amount });
    yield firestore
        .collection("account")
        .doc(receiverId)
        .set({ balance: (response === null || response === void 0 ? void 0 : response.balance) + amount });
    return;
});
exports.transferBalance = transferBalance;
const setstatus = (senderId, status, statuscode, id, isDebit) => __awaiter(void 0, void 0, void 0, function* () {
    yield firestore.collection("transactions").doc(senderId).set({
        transactionStatus: status,
        code: statuscode,
        transactionId: id,
        debit: isDebit,
    }, { merge: true });
});
exports.setstatus = setstatus;
