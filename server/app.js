const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoConnect = require('./db/connect');
mongoConnect();
const cors  = require('cors')
const path = require('path')
const https = require('https');
const fs = require('fs');

const router = require('./Router/router')
const authRouter = require('./Router/auth-Router')

app.use(express.json({limit : "500mb"}));
app.use(express.urlencoded({extended : true}));
app.use(cors())
// app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(router)
app.use(authRouter)
app.use('/uploads',express.static('./uploads'))



https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  }, app).listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`);
  });