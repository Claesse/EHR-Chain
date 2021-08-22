//Encryption and Decryption Speed Test
var CryptoJS = require('crypto-js');
var fs = require('fs');


var fileChoice = 'Test'

if (fileChoice == 'Big') {
    var start = Date.now();
    for (i = 0; i<1; i++) {
		fs.readFile('/home/oscar/testfiles/big.txt', function(err, data) {
		    if (err) throw err;
	        var wordArray = CryptoJS.lib.WordArray.create(data);           
	        var encrypted = CryptoJS.AES.encrypt(wordArray, "13").toString(); 
	        fs.writeFileSync("/home/oscar/testfiles/encrypted.txt", encrypted)
		});
        console.log("Finished Encryption, 1 iterations done on file of the size 1GB.")
    }
    var end = Date.now();
    var time = (end - start)/1;
    console.log("Average Performance\n"+time)
} else if (fileChoice == 'Medium') {
    var start = Date.now();
    for (i = 0; i<1; i++) {
		fs.readFile('/home/oscar/testfiles/medium.txt', function(err, data) {
		    if (err) throw err;
	        var wordArray = CryptoJS.lib.WordArray.create(data);           
	        var encrypted = CryptoJS.AES.encrypt(wordArray, "13").toString(); 
	        fs.writeFileSync("/home/oscar/testfiles/encrypted.txt", encrypted)
		});
        console.log("Finished Encryption, 1 iterations done on file of the size 500MB.")
    }
    var end = Date.now();
    var time = (end - start)/1;
    console.log("Average Performance\n"+time)
} else if (fileChoice == 'Small') {
    var start = Date.now();
    for (i = 0; i<1; i++) {
        console.log("Start of "+i)
		fs.readFile('/home/oscar/testfiles/small.txt', function(err, data) {
		    if (err) throw err;
	        var wordArray = CryptoJS.lib.WordArray.create(data);           
	        var encrypted = CryptoJS.AES.encrypt(wordArray, "13").toString(); 
	        fs.writeFileSync("/home/oscar/testfiles/encrypted.txt", encrypted)
		});
        console.log("Finished Encryption, 1 iterations done on file of the size 100MB.")
    }
    var end = Date.now();
    var time = (end - start)/1;
    console.log("Average Performance\n"+time)
    console.log("Done")

}

function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index=0, word, i;
    for (i=0; i<length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 14;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}



