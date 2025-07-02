const errorMiddleware = async (err, req, res, next) => {
    console.log(err);
    const defaultErrors = {
        statusCode: 500,
        message: 'something wned wrong'
    }

    // missing filed err
    if (err.name === 'ValidationError') {
        defaultErrors.statusCode = 400,
            defaultErrors.message = Object.values(err.erros).map(item => item.message).join(',')
    }
    if(err.code && err.code ===11000){ // 11000 is the code for duplicate fields
        defaultErrors.statusCode = 400,
        defaultErrors.message = 'user already exist (email)'
    }
    res.status(defaultErrors.statusCode).json(success = false,
        message = defaultErrors.message
    )
}
module.exports = { errorMiddleware };