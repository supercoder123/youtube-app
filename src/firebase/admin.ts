const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
import { getFirestore } from 'firebase-admin/firestore';
const serviceAccountConfig = require('../../lofty-apex-364211-4df42e8e6647.json');

import admin from 'firebase-admin';

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountConfig),
    })
    console.log('Initialized.')
} catch (error) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
        console.error('Firebase admin initialization error', error.stack)
    }
}
const db = getFirestore();

export default db;