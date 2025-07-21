import {
  AttestationPayload,
  SCHEMA_PAYLOAD,
  SCHEMA_UID,
} from "@/utils/attestation-constants";
import { eas, encodeData, handleError } from "@/utils/attestation-utils";
import { NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { Wallet } from "ethers";
import { NextRequest, NextResponse } from "next/server";

const mockAttestations: Omit<AttestationPayload, "recipient">[] = [
  {
    title: "Open Source Contribution",
    description: "Contributed to the development of a decentralized app.",
    contributors: [
      Wallet.createRandom().address,
      Wallet.createRandom().address,
    ],
    workStart: 1719830400,
    workEnd: 1720502400,
  },
  {
    title: "Smart Contract Audit",
    description:
      "Reviewed and audited contracts for potential vulnerabilities.",
    contributors: [Wallet.createRandom().address],
    workStart: 1721174400,
    workEnd: 1721433600,
  },
];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // TODO: Uncomment and use Zod validation when ready
    // TODO change payload to handle multiple
    // const zodData = SCHEMA_PAYLOAD.parse(data);
    // const { recipient, ...body } = zodData;
    // const encodedData = encodeData(body);
    const transaction = await eas.multiAttest([
      {
        schema: SCHEMA_UID,
        data: mockAttestations.map((attestation) => ({
          recipient: mockAttestations[0].contributors[0], // Using the first contributor as recipient for mock
          expirationTime: NO_EXPIRATION,
          revocable: true,
          data: encodeData(attestation),
        })),
      },
    ]);
    const newAttestationId = await transaction.wait();
    return NextResponse.json({
      message: "Attestation created successfully",
      attestationId: newAttestationId,
      transactionHash: transaction.receipt?.hash,
    });
  } catch (e) {
    return handleError(e);
  }
}
