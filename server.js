const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();

// instantiate an express app
const app = express();
app.use(express.static(path.join(__dirname, "assets")));

//make the contact page the the first page on the app
app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/index.html");
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //replace with your email provider
    port: 587,
    auth: {
        user: "huy.tran4997@gmail.com",
        pass: "ngoclan0304",
    },
});

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

app.post("/send", (req, res) => {
    //1.
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
        console.log(fields);
        Object.keys(fields).forEach(function (property) {
            data[property] = fields[property].toString();
        });

        //2. You can configure the object however you want
        const mail = {
            from: data.name,
            to: "huy.tran4997@gmail.com",
            subject: data.subject,
            text: `${data.name} <${data.email}> \n${data.message}`,
        };

        //3.
        transporter.sendMail(mail, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send("Something went wrong.");
            } else {
                res.status(200).send("Email successfully sent to recipient!");
            }
        });
    });
});

//port will be 5000 for testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});


