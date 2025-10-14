import * as yup from "yup"

export const accountCreateSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  role: yup.string().required("Role is required"),
  state: yup.string().required("State is required"),
  otpCode: yup
    .string()
    .matches(/^[0-9]{6}$/, "OTP Code must be exactly 6 digits")
    .required("OTP Code is required"),
})

export const accountEditSchema = yup.object({
  username: yup.string().required("Username is required"),
  role: yup.string().required("Role is required"),
  state: yup.string().required("State is required"),
  otpCode: yup
    .string()
    .matches(/^[0-9]{6}$/, "OTP Code must be exactly 6 digits")
    .required("OTP Code is required"),
})

export const deleteSchema = yup.object({
  otpCode: yup
    .string()
    .matches(/^[0-9]{6}$/, "OTP Code must be exactly 6 digits")
    .required("OTP Code is required"),
})

