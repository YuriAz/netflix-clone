import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDrYtuTugdcGDe3qC-YjYYRzTcSDaUAl-o',
  authDomain: 'netflix-clone-9c9b4.firebaseapp.com',
  projectId: 'netflix-clone-9c9b4',
  storageBucket: 'netflix-clone-9c9b4.appspot.com',
  messagingSenderId: '887996474147',
  appId: '1:887996474147:web:2129d8139c2d13d42d2296'
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { auth }
export default db
