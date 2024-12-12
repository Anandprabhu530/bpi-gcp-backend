import {credential} from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {FieldValue, Firestore} from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

export const transferBalance = async (
  senderId: string,
  receiverId: string,
  amount: number
) => {
  const res = await firestore.collection("account").doc(senderId).get();
  const senderid_response = res.data();

  const receiverid_res = await firestore
    .collection("account")
    .doc(receiverId)
    .get();
  const receiverid_response = receiverid_res.data();

  await firestore
    .collection("account")
    .doc(senderId)
    .update({balance: Number(senderid_response?.balance) - Number(amount)});

  await firestore
    .collection("account")
    .doc(receiverId)
    .update({balance: Number(receiverid_response?.balance) + Number(amount)});

  return;
};

export const setstatus = async (
  idToUpdate: string,
  toId: string,
  status: string,
  errorcode: number,
  id: any,
  amount: number,
  isDebit: boolean
) => {
  const TransactionDoc = firestore.collection("transactions").doc(idToUpdate);
  const userRef = await TransactionDoc.get();
  if (userRef.exists) {
    await firestore
      .collection("transactions")
      .doc(idToUpdate)
      .update({
        values: FieldValue.arrayUnion({
          from: toId,
          transactionStatus: status,
          errorCode: errorcode,
          transactionId: id,
          amount: amount,
          debit: isDebit,
        }),
      });
  } else {
    await firestore
      .collection("transactions")
      .doc(idToUpdate)
      .set({
        values: [
          {
            from: toId,
            transactionStatus: status,
            errorCode: errorcode,
            transactionId: id,
            amount: amount,
            debit: isDebit,
          },
        ],
      });
  }
};
