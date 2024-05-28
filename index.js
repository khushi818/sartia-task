const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' });
const AppError = require('./utils/AppError')
const globalErrorHandler = require("./utils/error")
const path = require("path")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const DB = (process.env.MONGO_URI).replace(
    "<password>",
    process.env.DATABASE_PASSWORD
);


mongoose.connect(DB).then(() => {
    console.log("DB successful");
});

app.use("/api/v1/", require("./routes/index"));

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404))
})

const port = process.env.PORT || 8000;

app.use(globalErrorHandler)

app
    .listen(port, () => {
        console.log(`server is running ${port}`);
    })
    .on("error", (err) => {
        console.log(err);
    });