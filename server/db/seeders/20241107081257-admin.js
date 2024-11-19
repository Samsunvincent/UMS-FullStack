const { users } = require('../model/model'); // Import the correct model

'use strict';

module.exports = {
  up: (models, mongoose) => {
    return users.insertMany([  // Use the model directly
      {
        "_id": "672c76de5e0c73ad44a7501f",
        "name": "Admin",
        "email": "admin@gmail.com",
        "password": "$2b$10$Eil1JMtUWYiIKIBgp8KkHOfX0XHeq0vi/DcxJlhNOoBneKlDD4Tza",
        "userType": "Admin"
      }
    ]).then(res => {
      console.log(res.insertedCount);  // Prints "1"
    });
  },

  down: (models, mongoose) => {
    return users.deleteMany({
      _id: {
        $in: [
          "672c76de5e0c73ad44a7501f",
        ]
      }
    }).then(res => {
      console.log(res.deletedCount);  // Prints "1"
    });
  }
};
