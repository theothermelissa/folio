import { NextApiRequest, NextApiResponse } from "next";
import {
  consumeCode,
  createCode,
  sendSms,
} from "supertokens-node/recipe/passwordless";
import prisma from "../../../lib/prisma";

async function getFeedOwner(subdomain: string) {
  const record = await prisma?.feed.findUnique({
    where: {
      subdomain: subdomain,
    },
    include: {
      owner: true,
    },
  });
  console.log("record in getFeedOwner: ", record);
  return record.owner;
}

export async function sendOTP(subdomain: string) {
  const feedOwner = await getFeedOwner(subdomain);
  if (!feedOwner) {
    throw new Error("No feed owner found");
  }
  const createCodeResponse = await createCode({
    phoneNumber: feedOwner.phone,
  });
  /**
         * TODO: add email support
         * For email, use this:
            // let response = await createCode({
            //   email,
            // });
         */

  // export type TypePasswordlessSmsDeliveryInput = {
  //     type: "PASSWORDLESS_LOGIN";
  //     phoneNumber: string;
  //     userInputCode?: string;
  //     urlWithLinkCode?: string;
  //     codeLifetime: number;
  //     preAuthSessionId: string;
  // };

  //   response from supertokens:  {
  //     status: '',
  //     preAuthSessionId: '',
  //     codeId: '',
  //     deviceId: '',
  //     userInputCode: '',
  //     linkCode: '',
  //     timeCreated: #,
  //     codeLifetime: #
  //   }
  console.log("createCodeResponse: ", createCodeResponse);
  const sentResponse = await sendSms({
    type: "PASSWORDLESS_LOGIN",
    phoneNumber: feedOwner.phone,
    userInputCode: createCodeResponse.userInputCode,
    codeLifetime: createCodeResponse.codeLifetime,
    preAuthSessionId: createCodeResponse.preAuthSessionId,
  });
  return {
    preAuthSessionId: createCodeResponse.preAuthSessionId,
    deviceId: createCodeResponse.deviceId,
  };
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    const subdomain = request.headers["x-subdomain"];
    console.log("subdomain in claim request: ", subdomain);
    console.log("request.body: ", request.body);
    if (!request.body) {
      try {
        const result = await sendOTP(subdomain.toString());
        console.log("result of sendOTP: ", result);
        // let response = await createCode({
        //     phoneNumber: phoneNumber,
        // });
        response.status(200).json({
          preAuthSessionId: result.preAuthSessionId,
          deviceId: result.deviceId,
        });
      } catch (error: any) {
        console.error("Error attempting to send OTP: ", error);
      }
    } else {
      console.log(" >>>>>> request.body was NOT blank: ", request.body);
      const { userInputCode, preAuthSessionId, deviceId } = request.body;

      // (input: {
      //     preAuthSessionId: string;
      //     userInputCode: string;
      //     deviceId: string;
      //     userContext?: any;
      // } | {
      //     preAuthSessionId: string;
      //     linkCode: string;
      //     userContext?: any;
      // })

      try {
        const consumeCodeResult = await consumeCode({
          preAuthSessionId,
          userInputCode,
          deviceId,
        });
        // .then((result) => {
        //   console.log("result: ", result);
        //   if (result.status === "OK") {
        //     return response.status(200).json({ message: "Success" });
        //   }
        //   return response
        //     .status(500)
        //     .json({ message: "Error; incorrect code." });
        // });
        console.log("consumeCodeResult: ", consumeCodeResult);
        response.status(200).json({ message: "Complete" });
      } catch (error) {
        console.error("Error attempting to consume code: ", error);
      }
    }
  }
}
