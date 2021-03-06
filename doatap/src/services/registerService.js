const DBConnection = require('../config/dbConnection');
const bcrypt = require('bcryptjs');

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        // check email is exist or not
        let isEmailExist = await checkExistEmail(data.email);
        if (isEmailExist) {
            reject(`Αυτό το email "${data.email}" χρησιμοποιείται ήδη`);
        } else {
            // hash password
            let salt = bcrypt.genSaltSync(10);
            let userItem = {
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                email: data.email,
                password: bcrypt.hashSync(data.password, salt),
                isAdmin: 0
            };

            console.log(userItem)

            //create a new account
            DBConnection.query(
                ' INSERT INTO user set ? ', userItem,
                function(err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve("Ο λογαριασμός σας δημιουργήθηκε επιτυχώς");
                }
            );
        }
    });
};

let checkExistEmail = (email) => {
    return new Promise( (resolve, reject) => {
        try {
            DBConnection.query(
                "SELECT * FROM user WHERE email = ? ", [email],
                function(err, result, fields) {
                    if (err) {
                        reject(err)
                    }
                    

                    if (result != undefined && result.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createNewUser: createNewUser
};
