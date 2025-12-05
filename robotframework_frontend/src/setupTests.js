 // jest-dom adds custom jest matchers for asserting on DOM nodes.
 // allows you to do things like:
 // expect(element).toHaveTextContent(/react/i)
 // learn more: https://github.com/testing-library/jest-dom
 // Ensure jest-dom is loaded for all test suites
 import '@testing-library/jest-dom';

 // Reset the api manual mock between tests to ensure isolation.
 // Note: The actual mocking of ../api/client is performed in each test utility file via jest.mock.
 try {
   // Ensure the manual mock is registered so we can access __helpers here
   jest.mock('./api/client');
   const { __helpers } = jest.requireMock('./api/client');
   beforeEach(() => {
     __helpers.resetApiMock();
   });
 } catch (_) {
   // ignore if module not available in certain environments
 }
