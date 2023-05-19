import 'whatwg-fetch'; // <-- yarn add whatwg-fetch
import 'setimmediate';

/* `require('dotenv').config()` loads environment variables from a `.env` file into `process.env`. In
this case, it is loading the environment variables from a `.env.test` file instead of the default
`.env` file. This allows for different environment variables to be used during testing. */
require('dotenv').config({
  path: '.env.test',
});

/* This code is mocking the `getEnvironment` module by replacing it with a function that returns a copy
of the `process.env` object. This is useful for testing purposes, as it allows the test to control
the environment variables that are used during testing. */
jest.mock('./src/helpers/getEnvironment', () => ({
  getEnvironments: () => ({ ...process.env }),
}));
