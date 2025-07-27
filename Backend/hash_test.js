const bcrypt = require("bcryptjs");

const plainPassword = "archie"; // The password you're trying to log in with
const storedHashedPassword = "$2b$10$a3omgpnNeFKVSdjHuDAqz.oBkfqVmAcKCNRpxqjiA2mGO3TL0fYxe"; // The one in your DB

// Hash the password again
bcrypt.hash(plainPassword, 10).then((newHash) => {
    console.log("Newly Hashed Password:", newHash);

    // Compare newly hashed password with the stored one
    bcrypt.compare(plainPassword, storedHashedPassword).then((match) => {
        console.log("Password Match Result:", match);
    });
});
