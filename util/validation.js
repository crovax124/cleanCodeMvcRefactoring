

function getSessionErrorData(req, defaultValues) {
    let sessionInputData = req.session.inputData;
  
    if (!sessionInputData) {
      sessionInputData = {
        hasError: false,
        ...defaultValues
      };
    }
  
    req.session.inputData = null;
    return sessionInputData;
}

function showErrorToSession(req, data, action) {
    req.session.inputData = {
        hasError: true,
        ...data
      };

      req.session.save(action);
}

function postIsValid(title, content) {
    return title &&
    content &&
    title.trim() !== "" &&
    content.trim() !== ""

}

function userCredentialsAreValid(email, confirmEmail, password) {
    return email &&
    confirmEmail &&
    password &&
    password.trim().length > 6 &&
    email === confirmEmail &&
    email.includes("@")
}

module.exports = {
    getSessionErrorData: getSessionErrorData,
    showErrorToSession: showErrorToSession,
    postIsValid: postIsValid,
    userCredentialsAreValid: userCredentialsAreValid
}