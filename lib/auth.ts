import {
  createCode,
  resendCode,
  getLoginAttemptInfo,
  consumeCode,
} from "supertokens-web-js/recipe/passwordless";

export async function handleOTPInput(otp: string) {
  try {
    let response = await consumeCode({
      userInputCode: otp,
    });

    if (response.status === "OK") {
      if (response.createdNewUser) {
        // console.log("Welcome to Folio!");
        // user sign up success -- trigger onboarding
      } else {
        // console.log("Welcome back!");
        // user sign in success -- leave them alone
      }
      // console.log("response: ", response);
      return response;
    } else if (response.status === "INCORRECT_USER_INPUT_CODE_ERROR") {
      // the user entered an invalid OTP
      window.alert(
        "Wrong OTP! Please try again. Number of attempts left: " +
          (response.maximumCodeInputAttempts -
            response.failedCodeInputAttemptCount)
      );
    } else if (response.status === "EXPIRED_USER_INPUT_CODE_ERROR") {
      // it can come here if the entered OTP was correct, but has expired because
      // it was generated too long ago.
      window.alert(
        "Old OTP entered. Please regenerate a new one and try again"
      );
    } else {
      // this can happen if the user tried an incorrect OTP too many times.
      window.alert("Login failed. Please try again");
      window.location.assign("/auth");
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message);
    } else {
      window.alert("Oops! Something went wrong.");
    }
  }
}

export async function hasInitialOTPBeenSent() {
  return (await getLoginAttemptInfo()) !== undefined;
}

export async function sendOTP(phoneNumber: string) {
  try {
    let response = await createCode({
      phoneNumber: phoneNumber,
    });
    /**
       * TODO: add email support
       * For email, use this:
          // let response = await createCode({
          //   email,
          // });
       */

    // OTP sent successfully.
    return response;
    // window.alert("Please check your email for an OTP");
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you,
      // or if the input email / phone number is not valid.
      window.alert(err.message);
    } else {
      window.alert("Oops! Something went wrong.");
    }
  }
}

export async function resendOTP() {
  try {
    let response = await resendCode();

    if (response.status === "RESTART_FLOW_ERROR") {
      // this can happen if the user has already successfully logged in into
      // another device whilst also trying to login to this one.
      window.alert("Login failed. Please try again");
      window.location.assign("/auth");
    } else {
      // OTP resent successfully.
      window.alert("Please check your email for the OTP");
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message);
    } else {
      window.alert("Oops! Something went wrong.");
    }
  }
}
