const errorMiddleware = async (err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        success:false,
        message:'Something went wrong',
        err
    })
}
module.exports = {errorMiddleware};