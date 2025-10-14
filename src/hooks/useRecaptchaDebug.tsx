import {useEffect} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

export const useRecaptchaDebug = () => {
  const {executeRecaptcha} = useGoogleReCaptcha();
  
  useEffect(() => {
    // Log trạng thái script
    if (!executeRecaptcha) {
      console.warn("[reCAPTCHA] executeRecaptcha chưa sẵn sàng (script chưa inject).");
      return;
    }
    
    console.log("[reCAPTCHA] executeRecaptcha đã sẵn sàng, thử gọi...");
    
    // Thử gọi recaptcha
    executeRecaptcha("debug_action")
      .then((token) => {
        console.log("[reCAPTCHA] token nhận được:", token);
      })
      .catch((err) => {
        console.error("[reCAPTCHA] lỗi khi gọi:", err);
      });
  }, [executeRecaptcha]);
};
