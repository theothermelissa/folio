import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { handleOTPInput, sendOTP } from "../lib/auth";

const Wrapper = styled(Flex)`
  flex-direction: row;
  justify-content: flex-end;
  height: 100%;
  align-items: center;
  margin-right: 24px;
  gap: 8px;
`;

const CodeInput = styled(Input)`
  width: 250px;
`;

export const ClaimFeed = () => {
  const router = useRouter();
  const { subdomain } = router.query;
  //   console.log("router.query in claim-feed: ", router.query);
  const [codeRequested, setCodeRequested] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO mpm: refactor this to be handled in the handleChangeCode function
  useEffect(() => {
    if (code.length > 5) {
      console.log("code length reached");
      setLoading(true);
      setShowCodeInput(false);
      handleSubmitCode();
    }
  }, [code]);

  const handleSubmitCode = async () => {
    handleOTPInput(code).then(() => {
      setLoading(false);
      setCode("");
    });
    //   const loadingOtp = { userInputCode: code, ...otpMetadata };
    //   console.log("loadingOtp to put into body: ", {
    //     userInputCode: code,
    //     ...otpMetadata,
    //   });
    //   const params: RequestInit = {
    //     headers: {
    //       "x-subdomain": subdomain.toString(),
    //     },
    //     method: "POST",
    //     body: JSON.stringify(loadingOtp),
    //   };
    //   const authResponse = await fetch("/api/account/claim", params).then((res) =>
    //     res.json()
    //   );
    //   console.log("authResponse: ", authResponse);
    //   if (authResponse.status === 200) {
    //     alert("Successfully claimed feed!");
    //   }
  };

  async function onOtpRequest() {
    setLoading(true);
    const result = await sendOTP("+12567106534");
    console.log("result of sendOTP: ", result);
    if (result && result.status === "OK") {
      setLoading(false);
      setShowCodeInput(true);
    }
  }

  return (
    <Wrapper>
      {showCodeInput ? (
        <CodeInput
          type="text"
          placeholder="Submit code"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setCode(event.target.value)
          }
        />
      ) : (
        <Button onClick={onOtpRequest} colorScheme="green">
          {loading ? <Spinner /> : "Claim this feed"}
        </Button>
      )}
    </Wrapper>
  );
};

// export const ClaimFeed = () => {
//   const [otpMetadata, setOtpMetadata] = useState({} as any);

//   //   const [emailRequested, setEmailRequested] = useState(false);

//

//   const handleRequestOtp = async () => {
//     const requestOtpMetadata = await fetch("/api/account/claim", {
//       method: "POST",
//       headers: {
//         "x-subdomain": subdomain.toString(),
//       },
//     }).then((res) => res.json());
//     console.log("requestOtpMetadata: ", requestOtpMetadata);
//     setLoading(false);
//     setShowCodeInput(!showCodeInput);
//     setOtpMetadata({ ...requestOtpMetadata });
//   };

//   return (
//
//   );
// };
