//So here when it will run validate in the rotues for register we will send registerSchema and for login we will send loginSchema and for change password we will send last one , so in router validate(registerSchema) means it will take things from req.body and validate and for login process is same but in req.body thing would be little different
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data;

  next();
};
