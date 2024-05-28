const AppError = require("./AppError.js");

const handleDuplicateFieldDB = err => {
    const message = `Duplicate ${Object.keys(err?.keyPattern)} : Please use other value`
    return new AppError(message, 400);
}

const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid input data, ${errors.join('. ')}`
    return new AppError(message, 400);
}

const handleJWTError = err => {
    return new AppError('Invalid Token, please login again', 401)
}

const handleJWTExpiredError = err => {
    return new AppError('Your token has expired', 403)
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })// to avoid leakage
    }
    else {
        // console.error('Error', err)
        res.status(500).json({
            status: 'error',
            message: 'something went wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'dev') {
        sendErrorDev(err, res)
    }
    else {
        let error = err
        if (err.code === 11000) error = handleDuplicateFieldDB(error)
        if (err.name === 'ValidationError') error = handleValidationError(error)
        if (err.name === 'JsonWebTokenError') error = handleJWTError(error)
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(error)
        console.log(error.stack)
        sendErrorProd(error, res)
    }
}