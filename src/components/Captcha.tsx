import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps{
    ref: any
}

export default function Captcha({ref}: CaptchaProps)
{
    const sitekey = process.env.NEXT_PUBLIC_GOOGLE_SITE_KEY as string

    function onChange(value : any) {
        console.log("Captcha value:", value);
    }
    
    return(
        <div className="captcha-group">
            <ReCAPTCHA 
                ref={ref}
                sitekey={sitekey}
                //onChange={onChange}
                size="invisible"
            />
        </div>
    )
}