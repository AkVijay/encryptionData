/**
 * Created by ishanarora on 30/03/19.
 */



const simpleencrypter =  require('simple-encryptor')(process.env.APP_SECRET);
const fs  = require('fs');


fs.readFile('./script.js', (err, data) => {
    fs.writeFile('./encryptedScript.js', simpleencrypter.encrypt(data.toString()), (err)=> {
    })
});
