import { collection, deleteDoc, getDocs } from 'firebase/firestore/lite';
import {
  addNewEmptyNote,
  savingNewNote,
  setActiveNote,
  startNewNote,
} from '../../../src/store/journal';
import { firebaseDB } from '../../../src/firebase/config';

describe('Pruebas en JournalThhunks', () => {
  const dispatch = jest.fn();
  const getState = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test('startNewNote debe de crear una nueva nota en blanco', async () => {
    const uid = 'TEST-UID';

    /* `getState.mockReturnValue({ auth: { uid } });` is setting up a mock return value for the
    `getState` function. In this case, it is returning an object with a nested `auth` property that
    has a `uid` value. This is being done to simulate the state of the application for the purpose
    of testing the `startNewNote` function. */
    getState.mockReturnValue({ auth: { uid } });

    await startNewNote()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(savingNewNote());
    expect(dispatch).toHaveBeenCalledWith(
      addNewEmptyNote({
        body: '',
        title: '',
        imageUrls: [],
        id: expect.any(String),
        date: expect.any(Number),
      })
    );

    expect(dispatch).toHaveBeenCalledWith(
      setActiveNote({
        body: '',
        title: '',
        imageUrls: [],
        id: expect.any(String),
        date: expect.any(Number),
      })
    );

    //Delete from firebase
    const collectionRef = collection(firebaseDB, `${uid}/journal/notes`);
    const docs = await getDocs(collectionRef);
    const deletePromises = [];

    /* Deleting all the documents in the "notes" collection of the Firebase database for the user with the
given UID. It first retrieves all the documents using `getDocs`, then creates an array of promises
to delete each document using `deleteDoc` and pushes them into `deletePromises`. Finally, it waits
for all the promises to resolve using `Promise.all` to ensure that all documents are deleted before
the test completes. This is done to clean up any test data that may have been created during the
test. */
    docs.forEach((doc) => deletePromises.push(deleteDoc(doc.ref)));
    await Promise.all(deletePromises);
  });
});
