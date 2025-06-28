import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailContent, sendMail } from "../utils/mail.js";

const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullname } = req.body;

  const exisitngUser = await User.findOne({
    email,
  });

  if (exisitngUser)
    return res.status(400).json({ message: "Email already registered" });

  const user = await User.create({
    username,
    fullname,
    password,
    email,
  });

  if (!user) {
    return res.status(400).json({
      message: "User cannot be creater",
      success: false,
    });
  }

  const { unhashedToken, hashedToken, tokenExpirey } =
    user.generateTemporaryToken();

  user.verificationToken = hashedToken;
  user.verificationTokenExpiry = tokenExpirey;

  await user.save();

  sendMail({
    email: user.email,
    subject: "Verificating account",
    mailGenContent: emailContent(
      user.username,
      `http://localhost:3000/api/v1/user/verify/${unhashedToken}`
    ),
  });

  res.status(200).json({
    message: "Sent verification token to your email",
    success: true,
  });
});

export { register };
