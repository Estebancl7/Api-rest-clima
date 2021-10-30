const Jwt = require("jsonwebtoken");

function jwtTokens({ user_id, user_email }) {
    const user = { user_id, user_email };
    const accessToken = Jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = Jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '14d' });
    return ({ accessToken, refreshToken });
}

module.exports = { jwtTokens }