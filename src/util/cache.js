
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
var CryptoJS = require('crypto-js');

// cryptography
function encrypt(phrase) {
    return CryptoJS.AES.encrypt(phrase, SECRET_KEY);
}

function decrypt(encryptedPhrase) {
    return CryptoJS.AES.decrypt(encryptedPhrase, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}

function getCachedObject(itemName) {
    var cachedDataObject = sessionStorage.getItem(itemName);
    if (cachedDataObject) {
        var decryptedDataObject = decrypt(cachedDataObject);
        if (decryptedDataObject) {
            return JSON.parse(decryptedDataObject);
        }
    }
    return null;
}

function setCachedObject(itemName, data) {
    var json = JSON.stringify(data);
    var encryptedJson = encrypt(json);
    sessionStorage.setItem(itemName, encryptedJson);
}

function setCachedObjectOnUpdate(itemName, data) {
    if (data !== sessionStorage.getItem(itemName) && data !== null) {
        var dataObjectJson = JSON.stringify(data);
        var encryptedDataObject = encrypt(dataObjectJson);
        sessionStorage.setItem(itemName, encryptedDataObject);
    }
}

export {
    getCachedObject,
    setCachedObject,
    setCachedObjectOnUpdate
}