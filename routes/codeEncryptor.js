const simpleencrypter =  require('simple-encryptor')(process.env.APP_SECRET);
const fs  = require('fs');


fs.readFile('cool.js', (err, data) => {
    console.log(err);
    console.log(data);
    fs.writeFile('./encryptedScript.js', simpleencrypter.encrypt(data.toString()), (err)=> {
    })
});