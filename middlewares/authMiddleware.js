const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next('auth failed');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        return next('auth failed');
    }
};

module.exports = userAuth;
