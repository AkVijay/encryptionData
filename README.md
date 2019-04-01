


The script to be encrypted is present in the routes folder. : 'script.js'

We will encrypt the Script using these steps:

cd routes
APP_SECRET = {secret} node codeEncryptor.js

This will generate the encryptedScript.js

//For machine specific code check -> Mac Address of my machine is used.
//For domain  specific check  : 'localhost:3000'


This encryptedScript is decrypted at compile time.

There are methods:

/users/register -> {usenname , password}
/users/login -> {username, password}

Mysql is hosted on a digital Ocean droplet

type this command to run the script:

APP_SECRET={secret} node ./bin/www





