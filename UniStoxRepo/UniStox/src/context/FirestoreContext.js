import { createContext, useContext } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const firestoreContext = createContext();

export function FirestoreContextProvider({ children }) {
  //create document in GCP Firestore from Firebase
  async function addDocument(doc, collectionName) {
    try {
      const docRef = await addDoc(collection(db, collectionName), doc);
      console.log(docRef);
      return docRef;
    } catch (e) {
      console.log(e);
      return "Error!" + e;
    }
  }
  //update document in GCP Firestore from Firebase
  async function updateDocument(docId, collectionName, fields) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, fields);
      return "Updated!";
    } catch (e) {
      return "Error!" + e;
    }
  }
  //retrieve document in GCP Firestore from Firebase
  async function getDocument(value, collectionName, field) {
    try {
      let reqDoc = null;
      const q = query(
        collection(db, collectionName),
        where(field, "==", value)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        reqDoc = doc;
      });
      return reqDoc;
    } catch (e) {
      return "Error!" + e;
    }
  }
  //get list of all documents
  async function getDocuments(value, collectionName, field) {
    try {
      let reqDocs = [];
      const q = query(
        collection(db, collectionName),
        where(field, "==", value)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        reqDocs.push(doc.data());
      });
      return reqDocs;
    } catch (e) {
      return "Error!" + e;
    }
  }

  return (
    <firestoreContext.Provider
      value={{ addDocument, getDocument, getDocuments, updateDocument }}
    >
      {children}
    </firestoreContext.Provider>
  );
}

export function useFirestore() {
  return useContext(firestoreContext);
}
