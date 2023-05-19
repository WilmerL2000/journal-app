import {
  authSlice,
  checkingCredentials,
  login,
  logout,
} from '../../../src/store/auth/authSlice';
import {
  authenticatedState,
  initialState,
  testUser,
} from '../../fixtures/authFixtures';

describe('Prueba en authSlice', () => {
  test('Debe de regresar el estado inicial y llamarse "auth"', () => {
    const state = authSlice.reducer(initialState, {});

    expect(authSlice.name).toBe('auth');
    expect(state).toEqual(initialState);
  });

  test('Debe realizar la autenticacion ', () => {
    const state = authSlice.reducer(initialState, login(testUser));
    expect(state).toEqual({
      status: 'authenticated',
      uid: testUser.uid,
      email: testUser.email,
      displayName: testUser.displayName,
      photoURL: testUser.photoURL,
      errorMessage: null,
    });
  });

  test('Debe de realizar el logout sin argumentos', () => {
    const state = authSlice.reducer(authenticatedState, logout());
    expect(state).toEqual({
      status: 'not-authenticated',
      uid: null,
      email: null,
      displayName: null,
      photoURL: null,
      errorMessage: undefined,
    });
  });

  test('Debe de hacer el logout y mostrar un mensaje de error', () => {
    const errorMessage = 'Credenciales no son correctas';
    const state = authSlice.reducer(
      authenticatedState,
      logout({ errorMessage })
    );

    expect(state).toEqual({
      status: 'not-authenticated',
      uid: null,
      email: null,
      displayName: null,
      photoURL: null,
      errorMessage,
    });
  });

  test('Debe de cambiar el estado a checking', () => {
    const state = authSlice.reducer(authenticatedState, checkingCredentials());
    expect(state.status).toBe('checking');
  });
});
