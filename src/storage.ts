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
  const response = res.data();

  await firestore
    .collection("account")
    .doc(senderId)
    .set({balance: response?.balance - amount});

  await firestore
    .collection("account")
    .doc(receiverId)
    .set({balance: response?.balance + amount});

  return;
};

export const setstatus = async (
  idToUpdate: string,
  toId: string,
  status: string,
  errorcode: number,
  id: any,
  isDebit: boolean
) => {
  await firestore
    .collection("transactions")
    .doc(idToUpdate)
    .update({
      values: FieldValue.arrayUnion({
        from: toId,
        transactionStatus: status,
        errorCode: errorcode,
        transactionId: id,
        debit: isDebit,
      }),
    });
};
