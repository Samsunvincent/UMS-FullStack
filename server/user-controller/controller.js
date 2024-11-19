const { users } = require('../db/model/model');

const { fileDelete } = require('../util/delete-file');
const { success_function, error_function } = require('../util/response-handler')
const bcrypt = require('bcrypt')
const sendemail = require('../util/send-email').sendEmail
const resetPassword = require('../user-controller/email-templates/set-password').resetPassword
const fileupload = require('../util/file-upload').fileUpload
const path = require('path');
const dotenv = require("dotenv");
const { dataUpload, getserverData } = require('../util/file-upload');

dotenv.config()





exports.signin = async function (req, res) {
    try {

        let body = req.body;
        console.log('body from signin', body);

        let body_user_type = body.userType;
        console.log("body_user_type", body_user_type);

        let emails = body.email;
        console.log("email", emails)

        let name = body.name;
        console.log("name", name);


        // let match = await userType.findOne({ user_type : body.user_type});
        // console.log('match',match);

        // let id = match._id;
        // body.user_type = id
        // console.log('body.userType',body.user_type)

        let image = body.image;
        console.log("image nnnnn", image);

        if (image) {
            let img_path = await fileupload(image, "user");
            console.log("img_path", img_path);
            body.image = img_path
        }


        function generateRandomPassword(length) {
            let charset =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
            let password = "";

            for (var i = 0; i < length; i++) {
                var randomIndex = Math.floor(Math.random() * charset.length);
                password += charset.charAt(randomIndex);
            }

            return password;
        }

        var randomPassword = generateRandomPassword(12);
        console.log('randomPassword', randomPassword);

        // let content = await resetPassword(name,emails,randomPassword)

        // await sendemail(emails,"update password",content)



        let salt = bcrypt.genSaltSync(10);
        let password = bcrypt.hashSync(randomPassword, salt);
        console.log("password0", password);



        let new_body = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            phone: req.body.phone,
            age: req.body.age,
            userType: body_user_type,
            image: req.body.image

        }




        // let hashed_confirm_Password = bcrypt.hashSync(body.confirm_password,salt);




        // body.confirm_password = hashed_confirm_Password;
        // console.log("hashed_confirm_password : ",hashed_confirm_Password);

        // save to database

        let new_user = await users.create(new_body)


        let response = success_function({
            success: true,
            statusCode: 200,
            message: "user created succesfully"
        })
        res.status(response.statusCode).send(response)
        return;
    } catch (error) {
        console.log("error", error)
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "user creation failed"
        })
        res.status(response.statusCode).send(response)
        return;
    }
}


//ENTER DATA TO DATAS.JSON

// exports.signin = async function(req, res) {
//     try {
//         let body = req.body;
//         console.log('Body from signin:', body);

//         let { user_type, email, name, image, phone, age } = body;
//         console.log('User type:', user_type);
//         console.log('Email:', email);
//         console.log('Name:', name);

//         // If an image is provided, upload it and update the image path in the body
//         if (image) {
//             let img_path = await fileupload(image, "user");
//             console.log("Image path:", img_path);
//             body.image = img_path;
//         }

//         // Function to generate a random password
//         function generateRandomPassword(length) {
//             const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
//             let password = "";
//             for (let i = 0; i < length; i++) {
//                 let randomIndex = Math.floor(Math.random() * charset.length);
//                 password += charset.charAt(randomIndex);
//             }
//             return password;
//         }

//         let randomPassword = generateRandomPassword(12);
//         console.log('Generated random password:', randomPassword);

//         // Hash the generated random password
//         let salt = bcrypt.genSaltSync(10);
//         let hashedPassword = bcrypt.hashSync(randomPassword, salt);
//         console.log('Hashed password:', hashedPassword);

//         // Fetch server data to get the current list of users
//         let serverData = await getserverData();
//         let dataArr = [];

//         if (serverData === null) {
//             // If no server data exists, start with an empty array
//             console.log('No existing users found. Initializing user list.');
//         } else {
//             // Parse the existing server data (array of users)
//             dataArr = JSON.parse(serverData);
//             console.log('Existing users:', dataArr);
//         }

//         // Generate a unique user ID based on the length of the current user array
//         let userId = dataArr.length + 1; // ID is one more than the length of the array
//         console.log('Generated User ID:', userId);

//         // Create a new body object with all the required fields, including the generated ID
//         let new_body = {
//             id: userId, // Assign the ID based on array length
//             name: name,
//             email: email,
//             password: hashedPassword,
//             phone: phone,
//             age: age,
//             userType: user_type,
//             image: body.image
//         };

//         // Add the new user to the data array
//         dataArr.push(new_body);
//         console.log('Updated user list:', dataArr);

//         // Convert the updated data array to a string for storage
//         let strbody = JSON.stringify(dataArr);

//         // Upload the updated data to the server
//         await dataUpload(strbody, 'datas');

//         // Return a success response
//         let response = success_function({
//             success: true,
//             statusCode: 200,
//             message: "User created successfully"
//         });
//         res.status(response.statusCode).send(response);
//     } catch (error) {
//         console.error('Error:', error);

//         // Return an error response
//         let response = error_function({
//             success: false,
//             statusCode: 400,
//             message: "User creation failed"
//         });
//         res.status(response.statusCode).send(response);
//     }
// };


exports.getAllData = async function (req, res) {
    try {

        let user_data = await users.find().populate('userType')
        console.log("user_Data", user_data);

        //JSON GET ALL DATA

        // let datas = await getserverData()

        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Data fetching successfull",
            data: user_data
        })
        res.status(response.statusCode).send(response)
        return;

    } catch (error) {
        console.log("error", error);

        let response = error_function({
            success: false,
            statusCode: 400,
            message: "user fetching failed"
        })
        res.status(response.statusCode).send(response)
        return;

    }
}


// GET DATAS.JSON SINGLE DATA

// exports.getsingle = async function (req,res){
//     try {

//         let singleid = req.params.id
//         console.log("Singleid",singleid ,typeof(singleid));

//         let parsed_id  = JSON.parse(singleid);
//         console.log("parsed_id",parsed_id)


//         SingleData = await login.findOne({parsed_id :singleid}).populate('userType')
//         console.log("SingleUser",SingleData);

//         let data = await getserverData();
//         console.log("data from single",data)

//         let parsed_data = JSON.parse(data);
//         console.log("parsed_data",parsed_data)



//         // JSON GET SINGLE DATA



//         let Singledata =''
//         console.log("parseddatra[0",parsed_data[0].id);

//         for(let i=0; i<parsed_data.length; i++){

//             if(parsed_data[i].id == singleid){

//                 Singledata = parsed_data[i];
//             }
//         }
//         console.log("single data",SingleData)



//         let response = success_function({
//          success: true,
//          statuscode: 200,
//          message: "successfully get the single data..",
//          data : Singledata
//      })
//      res.status(response.statusCode).send(response)
//      return;

//  } catch (error) {

//      console.log("error : ", error);
//      let response = error_function({
//          success: false,
//          statuscode: 400,
//          message: "error"
//      })
//      res.status(response.statusCode).send(response)
//      return;
//  }

// }

exports.getsingle = async function (req, res) {

    let id = req.params.id;
    console.log("id from getsingle data", id);

    if (id) {
        let singleUser = await users.findOne({ _id: id }).populate('userType')
        console.log("match_id from database", singleUser);

        if (!singleUser) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Something Went Wrong",

            });
            res.status(response.statusCode).send(response);
            return;
        }
        else {
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "Single User Fetching Successfull",
                data: singleUser
            })
            res.status(response.statusCode).send(response);
            return;

        }
    }
    else {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "id is not available",

        });
        res.status(response.statusCode).send(response);
        return;


    }



}


exports.updateUser = async function (req, res) {
    try {
        let id = req.params.id;
        let body = req.body;

        if (!body.name) {
            let response = error_function({
                statusCode: 400,
                message: "name required",
            });
            res.status(response.statusCode).send(response);
            return;
        }
        if (!body.email) {
            let response = error_function({
                statusCode: 400,
                message: "email required",
            });
            res.status(response.statusCode).send(response);
            return;
        }
        let img_path_to_delete;
        let image_to_Delete;
        if (body.image) {
            let b64 = body.image;
            let user = await users.findOne({ _id: id });
            if (user.image) {
                console.log("user : ", user.image);
                img_path_to_delete = user.image.split('/')[2];
            } else {
                image_to_Delete = null;
            }
            let image = await fileupload(b64, "users");
            console.log("image : ", image);
            body.image = image;
        }

        await users.updateOne({ _id: id }, { $set: body });

        if (body.image) {
            if (image_to_Delete !== null) {
                let image_to_Delete = path.join('./uploads', 'users', img_path_to_delete);
                fileDelete(image_to_Delete);
            }
        }

        let response = success_function({
            statusCode: 200,
            message: "user updated successfully"
        });
        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.log("error : ", error);
        let response = error_function({
            statusCode: 400,
            message: error.message ? error.message : "something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }


}



exports.deleteUser = async function (req, res) {
    try {

        let id = req.params.id;
        console.log("id from delete", id);

        let delete_Data = await users.deleteOne({ _id: id });
        console.log("delete_Data", delete_Data);

        let response = success_function({
            success: true,
            statusCode: 200,
            message: "delete successfull",
            data: delete_Data
        })
        res.status(response.statusCode).send(response);
        return;

    } catch (error) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "deleting failed",

        })
        res.status(response.statusCode).send(response)
        return;
    }


}

exports.resetPassword = async function (req, res) {
    try {
        let _id = req.params.id;

        let user = await users.findOne({ _id });
        if (!user) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: 'User not found'
            })
            res.status(response.statusCode).send(response);
            return;
        }


        let passwordMatch = bcrypt.compareSync(req.body.currentPassword, user.password);
        if (!passwordMatch) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: 'Incorrect current password'
            })
            res.status(response.statusCode).send(response);
            return;
        }


        // Proceed with password reset if the current password is correct
        let newpassword = req.body.newPassword;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);

        let updatePassword = await users.updateOne({ _id }, { $set: { password: hashedPassword } });
        if (updatePassword.nModified === 0) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: 'Failed to update password'
            })
            res.status(response.statusCode).send(response);
            return;
        }


        if (user.isFirstLogin) {
            user.isFirstLogin = false;
            await user.save();
        }

        let response = success_function({
            success: true,
            statusCode: 200,
            message: "password reset successfull"
        });
        res.status(response.statusCode).send(response);
        return;

    } catch (error) {
        console.log("Error:", error);
        let response = error_function({
            success: false,
            statusCode: 400,
            message: 'password reset failed'
        })
        res.status(response.statusCode).send(response);
        return;
    }
};


