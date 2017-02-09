'use strict';

/**
 * Defines a utility object.
 */
const Util = {

    /**
     * Determines if a parameter is an object.
     *
     * @param {*} obj The parameter to check.
     * @return {boolean} True if object, false otherwise.
     */
    isObject: (obj) => {
        return typeof obj === 'object';
    },

    /**
     * Determines if a parameter is a string.
     *
     * @param {*} str The parameter to check.
     * @return {boolean} True if string, false otherwise.
     */
    isString: (str) => {
        return typeof str === 'string';
    },

    /**
     * Determines if a parameter is a number.
     *
     * @param {*} num The parameter to check.
     * @return {boolean} True if number, false otherwise.
     */
    isNumber: (num) => {
        return typeof num === 'number';
    },

    /**
     * Determines if a parameter is an array.
     *
     * @param {*} arr The parameter to check.
     * @return {boolean} True if array, false otherwise.
     */
    isArray: (arr) => {
        return Array.isArray(arr);
    },

    /**
     * Loops over object keys.
     *
     * @param {object} object The object.
     * @param {function} iterator The iterator function, called with (key, value)
     */
    forEach: (object, iterator) => {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                iterator(key, object[key]);
            }
        }
    }
};

module.exports = Util;
