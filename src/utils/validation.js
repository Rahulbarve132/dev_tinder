const validator = require("validator");

const validatorSignUp = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter a valid Name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid Email id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong Password");
  }
};

const validateProfileFields = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "bio",
    "skills",
  ];
 const isEditAllowed =  Object.keys(req.body).every((field) => allowedFields.includes(field));


  return isEditAllowed;
};

module.exports = { validatorSignUp, validateProfileFields };
