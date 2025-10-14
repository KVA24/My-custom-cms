import * as yup from "yup"

export const loginSchema = yup.object({
  username: yup.string().required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  otpCode: yup.string()
})

export const registerSchema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: yup.string().email("Please enter a valid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
})

export const changePassSchema = yup.object({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().required("New password is required"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Confirm new password must match")
    .required("Please confirm your password"),
  otpCode: yup
    .string()
    .matches(/^[0-9]{6}$/, "OTP Code must be exactly 6 digits")
    .required("OTP Code is required"),
})
