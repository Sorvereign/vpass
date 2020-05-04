/**
 MIT License

Copyright (c)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 */
(() => {
  const crypto = require("crypto");
  let string = "";
  let array = [];
  /**
   * What it says.
   *
   * @param {[TODO:type]} string - [TODO:description]
   * @return the digest hash
   */
  function toSha256(s) {
    string = s;
    let hash = crypto.createHash("sha256");
    hash.update(s);

    return hash.digest("hex");
  }

  /**
   * Generate a random number between 1 and 26 who
   * are indexes of letter in the alphabet
   *
   * @return {[TODO:type]} [TODO:description]
   */
  function random() {
    for (var i = 0; i <= 24; i++) {
      array.push(Math.floor(Math.abs(Math.random() * 27 - 1) + 1));
      console.log(array[i]);
    }
    return getAlphabetLetter(array);
  }

  /**
   * get the alphabet letter that belongs to the index
   * passed as a argument and concatenate it
   * with the a string
   *
   * @param {String} position - [the array with the indexes]
   * @return {[TODO:type]} [TODO:description]
   */
  function getAlphabetLetter(position) {
    return [...position]
      .map((element) => {
        let letter = String.fromCharCode(97 + element);
        letter = string.concat(letter);
      })
      .filter((element) => element >= 0);
    return letter;
  }
  toSha256("aaa");
  random();
})();
