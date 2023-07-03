import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

const Wrapper = styled(Flex)`
  flex-direction: row;
  justify-content: flex-end;
  //   width: 33%;
  height: 100%;
  align-items: center;
  margin-right: 24px;
  gap: 8px;
`;

const CodeInput = styled(Input)`
  width: 250px;
`;

const handleCodeSubmit = async (code: string) => {
  // check if the code is correct
};

export const ClaimFeed = () => {
  const router = useRouter();
  const { subdomain } = router.query;
  console.log("router.query in claim-feed: ", router.query);

  //   const [codeRequested, setCodeRequested] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [otpMetadata, setOtpMetadata] = useState({} as any);

  useEffect(() => {
    if (code.length > 5) {
      console.log("code length reached");
      setCode("");
      setSubmitted(true);
      setShowCodeInput(false);
      handleSubmitCode();
    }
  }, [code]);
  //   const [emailRequested, setEmailRequested] = useState(false);

  const handleSubmitCode = async () => {
    const submittedOtp = { userInputCode: code, ...otpMetadata };
    console.log("submittedOtp to put into body: ", {
      userInputCode: code,
      ...otpMetadata,
    });
    const params: RequestInit = {
      headers: {
        "x-subdomain": subdomain.toString(),
      },
      method: "POST",
      body: JSON.stringify(submittedOtp),
    };
    const authResponse = await fetch("/api/account/claim", params).then((res) =>
      res.json()
    );
    console.log("authResponse: ", authResponse);
    if (authResponse.status === 200) {
      alert("Successfully claimed feed!");
    }
  };

  const handleRequestOtp = async () => {
    const requestOtpMetadata = await fetch("/api/account/claim", {
      method: "POST",
      headers: {
        "x-subdomain": subdomain.toString(),
      },
    }).then((res) => res.json());
    console.log("requestOtpMetadata: ", requestOtpMetadata);
    setSubmitted(false);
    setShowCodeInput(!showCodeInput);
    setOtpMetadata({ ...requestOtpMetadata });
  };

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
        <Button onClick={handleRequestOtp} colorScheme="green">
          {submitted ? <Spinner /> : "Claim this feed"}
        </Button>
      )}
    </Wrapper>
  );
};
