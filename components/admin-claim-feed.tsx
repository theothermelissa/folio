import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { handleOTPInput, sendOTP } from "../lib/auth";
import { FetchConfig } from "../pages/feed/[subdomain]/posts";
import useSWR from "swr";

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

const fetcher = (url: string, config: FetchConfig) =>
  fetch(url, config).then((res) => res.json());

export const ClaimFeed = () => {
  const router = useRouter();
  const { subdomain } = router.query;

  const url = "/api/account/phone";

  const { data, isLoading, error } = useSWR(subdomain ? url : null, () =>
    fetcher(url, {
      headers: {
        "x-subdomain": subdomain?.toString(),
      },
    })
  );

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

  if (!subdomain) {
    return null;
  }

  const handleSubmitCode = async () => {
    handleOTPInput(code).then((result) => {
      if (result && result.status === "OK") {
      }
      // console.log("result of handleOTPInput: ", result);
      setLoading(false);
      setCode("");
    });
  };

  async function onOtpRequest() {
    setLoading(true);
    if (error) {
      alert(error);
      return;
    }
    if (data) {
      const { phone } = data;
      console.log("phone: ", phone);
      const result = await sendOTP(phone);
      console.log("result of sendOTP: ", result);
      if (result && result.status === "OK") {
        setLoading(false);
        setShowCodeInput(true);
      }
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
