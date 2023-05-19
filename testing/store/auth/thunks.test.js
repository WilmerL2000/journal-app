import {
  sighInWithGoogle,
  loginWithEmailPassword,
  logoutFirebase,
} from '../../../src/firebase/providers';
import {
  checkingCredentials,
  login,
  logout,
  startGoogleSignIn,
  startLoginWithEmailPassword,
  startLogout,
} from '../../../src/store/auth';
import { checkingAuthentication } from '../../../src/store/auth/thunks';
import { clearNotesLogout } from '../../../src/store/journal/journalSlice';
import { testUser } from '../../fixtures/authFixtures';

/* `jest.mock('../../../src/firebase/providers');` is mocking the `providers` module located at the
specified path. This means that any import statements that reference this module will be replaced
with a mock implementation during the test. This is useful for isolating the code being tested from
external dependencies and ensuring that the test is only focused on the specific functionality being
tested. */
jest.mock('../../../src/firebase/providers');

describe('Pruebas en AuthThhunks', () => {
  const dispatch = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test('Debe de invocar el checkingCredentials', async () => {
    /* `await checkingAuthentication()(dispatch);` is calling the `checkingAuthentication` function
    which returns another function that takes `dispatch` as an argument. The returned function is
    then immediately invoked with `dispatch` as its argument. The `await` keyword is used to wait for
    the asynchronous operation inside `checkingAuthentication` to complete before moving on to the
    next line of code. */
    await checkingAuthentication()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
  });

  test('StartGoogleSignIn debe de llamar checkingCredentials y login - Exito', async () => {
    //Result
    const loginData = { ok: true, ...testUser };

    /* `await sighInWithGoogle.mockResolvedValue(loginData);` is setting up a mock implementation for
    the `sighInWithGoogle` function from the `providers` module. It is telling the mock
    implementation to return a resolved promise with the value of `loginData` when
    `sighInWithGoogle` is called during the test. This allows the test to simulate a successful
    login with Google. */
    await sighInWithGoogle.mockResolvedValue(loginData);

    //thunk
    await startGoogleSignIn()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(login(loginData));
  });

  test('StartGoogleSignIn debe de llamar checkingCredentials y logout - Error', async () => {
    const loginData = { ok: false, errorMessage: 'Un error en google' };

    await sighInWithGoogle.mockResolvedValue(loginData);

    await startGoogleSignIn()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(logout(loginData.errorMessage));
  });

  test('startLoginWithEmailPassword debe de llamar checkingCredentials y login - Exito', async () => {
    //Result
    const loginData = { ok: true, ...testUser };

    //Sended data
    const formData = { email: testUser.email, password: '123456' };

    await loginWithEmailPassword.mockResolvedValue(loginData);

    /* `await startLoginWithEmailPassword(formData)(dispatch);` is calling the
    `startLoginWithEmailPassword` function with `formData` as its argument, which returns another
    function that takes `dispatch` as an argument. The returned function is then immediately invoked
    with `dispatch` as its argument. The `await` keyword is used to wait for the asynchronous
    operation inside `startLoginWithEmailPassword` to complete before moving on to the next line of
    code. */
    await startLoginWithEmailPassword(formData)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(login({ ...testUser }));
  });

  test('startLogout debe de llamar logoutFirebase,  clearNote y logout', async () => {
    await startLogout()(dispatch);

    expect(logoutFirebase).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(clearNotesLogout());
    expect(dispatch).toHaveBeenCalledWith(logout({}));
  });
});
