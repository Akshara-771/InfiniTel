const bcrypt = require("bcryptjs");

const newPassword = "password123"; // Use the correct password
bcrypt.hash(newPassword, 10).then((newHash) => {
    console.log("New Correct Hash:", newHash);
});
