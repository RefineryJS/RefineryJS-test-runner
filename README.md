RefineryJS test runner
=======================

A tiny test runner for RefineryJS plugins.

# Usage

Note that this project also follows the structure below.

1. Make `test/integration` directory in your project root.

  ```
  -myProject/
   |
   \-test/
     |
     \-integration/
  ```

1. [Optional] Make `init.js` which exports `dependencies` and `option`

  ```
  -myProject/test/integration/
   |
   \-init.js
  ```

1. Add some directories named with your test case's name.

  ```
  -myProject/test/integration/
   |
   +-init.js
   |
   \-someTestCase/
  ```

1. Add `input.refjs` and `expect.js` files in there.

  ```
  -myProject/test/integration/
   |
   +-init.js
   |
   \-someTestCase/
     |
     +-input.refjs
     |
     \-expect.js
  ```

1. Write your plugin's syntax in `input.refjs`.

1. Write JavaScript code that your `input.refjs` should be transpiled in `expect.js`.

1. run `$ test-refineryjs`

1. ????

1. PROFIT!!!
