import { randomBytes } from 'crypto';
import momenttz from 'moment-timezone';

/**
 * It generates a random number with a length of 4 or 6 digits
 * @param {number} pjg - number
 * @returns A random number
 */
export function CreateRandomNumber(pjg: number): string {
  const random_number = parseInt(randomBytes(4).toString('hex'), 16).toString();
  if (pjg == 4) {
    return random_number.substring(random_number.length - 4);
  }
  return random_number.substring(random_number.length - 6);
}

/**
 * If the file extension is not .jpg, .jpeg, .png, or .gif, then return an error
 * @param {any} req - The request object.
 * @param {any} file - The file that was uploaded.
 * @param callback - A callback function that accepts two parameters: error and boolean.
 */
export const imageFileFilter = (req: any, file: any, callback) => {
  if (
    !file.originalname.match(/\.(jpg|jpeg|png|gif)$/) &&
    !file.mimetype.includes('png') &&
    !file.mimetype.includes('jpg') &&
    !file.mimetype.includes('jpeg') &&
    !file.mimetype.includes('gif')
  ) {
    req.fileValidationError = 'file.image.not_allowed';
    callback(null, false);
  }
  callback(null, true);
};

/**
 * It takes a filename as an argument and returns a URL to the image
 * @param {any} filename - The filename of the image you want to create a URL for.
 * @returns the value of the variable BASEURL_API + '/api/v1/storage/image' + filename.
 */
export const createUrl = function (filename: any) {
  if (typeof filename == 'undefined' || filename == null || filename == '') {
    return null;
  } else {
    return process.env.BASEURL_API + '/api/v1/storage/image' + filename;
  }
};

/**
 * It takes a string as an input, and returns a string as an output
 * @param {string} time - string
 * @returns A function that takes a string as an argument and returns a string.
 */
export const formatingOutputTime = function formatingOutputTime(time: string) {
  return momenttz(time).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
};

/**
 * It takes an object and recursively searches for any keys that end with '_at' and then formats the
 * value of that key
 * @param {any} object - any - the object that you want to format
 */
export const formatingAllOutputTime = function formatingAllOutputTime(
  object: any,
) {
  for (const key in object) {
    if (object[key] && key.endsWith('_at')) {
      object[key] = this.formatingOutputTime(object[key]);
    }
    if (object[key] && typeof object[key] === 'object') {
      this.formatingAllOutputTime(object[key]);
    }
  }
};

/**
 * It removes all fields that end with 'password' from an object
 * @param {any} object - any - The object to remove the password fields from.
 */
export const removeAllFieldPassword = function removeAllFieldPassword(
  object: any,
) {
  for (const key in object) {
    if (object[key] && key.endsWith('password')) {
      delete object[key];
    }
    if (object[key] && typeof object[key] === 'object') {
      this.removeAllFieldPassword(object[key]);
    }
  }
};

/**
 * It takes a camelCase string and returns a snake_case string
 * @param {string} camel - string - The camel case string to convert to snake case.
 * @returns A function that takes a string and returns a string.
 */
export const camelToSnake = function camelToSnake(camel: string): string {
  return camel.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * It takes a string and returns a new string with all the HTML special characters replaced with their
 * HTML entities
 * @param inputString - The string to be sanitized.
 * @returns A string with the characters &, ", ', <, and > replaced with their HTML entity equivalents.
 */
export function sanitizeHTML(inputString) {
  const lookup = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
  };
  return inputString.replace(/[&"'<>]/g, (character) => lookup[character]);
}
