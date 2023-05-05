import { collection, getDocs } from 'firebase/firestore/lite';
import { firebaseDB } from '../firebase/config';

/**
 * This function loads notes from a Firebase database collection and returns them as an array.
 * @param [uid] - The `uid` parameter is a string that represents the user ID. It is used to specify
 * the path to the collection of notes in the Firebase database. If no `uid` is provided, the default
 * value is an empty string.
 * @returns The `loadNotes` function is returning an array of notes. Each note is an object with an
 * `id` property (which is the document ID in the Firestore collection) and all the data stored in the
 * document as additional properties in the object.
 */
export const loadNotes = async (uid = '') => {
  const collectionRef = collection(firebaseDB, `${uid}/journal/notes`);
  const docs = await getDocs(collectionRef);

  const notes = [];
  docs.forEach((doc) => {
    notes.push({ id: doc.id, ...doc.data() });
  });

  return notes;
};
