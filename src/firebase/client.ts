import { FirebaseApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyC4eoBC80aEtdnjIgbL4A9vyJqln1w22us",
    authDomain: "lofty-apex-364211.firebaseapp.com",
    projectId: "lofty-apex-364211",
    storageBucket: "lofty-apex-364211.appspot.com",
    messagingSenderId: "613173215258",
    appId: "1:613173215258:web:30b00ade1f947b220891a3"
};

type FirebaseModule = typeof import('firebase/app');
type FirebaseAuthModule = typeof import('firebase/auth');
type FirebaseFirestoreModule = typeof import('firebase/firestore');

export const getFirebaseClient = async (): Promise<[FirebaseModule, FirebaseAuthModule, FirebaseFirestoreModule, FirebaseApp]> => {
    const firebase = await import('firebase/app')
    const app = firebase.initializeApp(firebaseConfig)

    const [firebaseAuth, firebaseFirestore] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
    ]);

    return [firebase, firebaseAuth, firebaseFirestore, app];
}


