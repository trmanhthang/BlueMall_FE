import { initializeApp  } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD7hohDGrraacs51adaxm-JjxRe6Tj-6Q8",
    authDomain: "product-3af6c.firebaseapp.com",
    projectId: "product-3af6c",
    storageBucket: "product-3af6c.appspot.com",
    messagingSenderId: "636857773198",
    appId: "1:636857773198:web:d87c8ac7926a07db616ddf",
    measurementId: "G-E68VFJDHHB"
};

initializeApp(firebaseConfig);
const storage = getStorage()
export default storage;