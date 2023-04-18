import firebase from "firebase/compat"


export default interface Iclip{
    uid:string,
    displayName:string,
    title:string,
    fileName:string,
    url:string,
    timestamp:firebase.firestore.FieldValue
    docId?:string,
    screenShotURL:string,
    screenShotFileName:string;
}