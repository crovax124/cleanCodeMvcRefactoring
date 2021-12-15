function addCsrfToken(req, res, next) {
    res.locals.csrfToken = req.csrfToken();  // adding csrftoken to the response of the middleware
    next();
}

module.exports = addCsrfToken;