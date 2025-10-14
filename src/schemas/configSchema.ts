import * as yup from "yup"

export const configSchema = yup.object({
  keyConfig: yup.string().required("Key is required"),
  valueConfig: yup.string().required("Value is required"),
  otpCode: yup
    .string()
    .matches(/^[0-9]{6}$/, "OTP Code must be exactly 6 digits")
    .required("OTP Code is required"),
})

export const configDeleteSchema = yup.object({
  otpCode: yup
    .string()
    .matches(/^[0-9]{6}$/, "OTP Code must be exactly 6 digits")
    .required("OTP Code is required"),
})
