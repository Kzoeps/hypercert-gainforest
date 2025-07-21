import {
  AttestationPayload,
  EAS_SCHEMA_PAYLOAD,
  EAS_SCHEMA_PAYLOAD_MULTI,
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
    const zodData = EAS_SCHEMA_PAYLOAD_MULTI.parse(data);
    if (zodData.length === 1) {
      const [{ recipient, ...body }] = zodData;
      const transaction = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient, // Using a random address for mock
          expirationTime: NO_EXPIRATION,
          revocable: true,
          data: encodeData(body),
        },
      });
      const newAttestationId = await transaction.wait();
      return NextResponse.json({
        message: "Attestation created successfully",
        attestationId: newAttestationId,
        transactionHash: transaction.receipt?.hash,
      });
    } else if (zodData.length > 1) {
      const transaction = await eas.multiAttest([
        {
          schema: SCHEMA_UID,
          data: zodData.map(({ recipient, ...body }) => ({
            recipient,
            expirationTime: NO_EXPIRATION,
            revocable: true,
            data: encodeData(body),
          })),
        },
      ]);
      const newAttestationId = await transaction.wait();
      return NextResponse.json({
        message: "Multiple attestations created successfully",
        attestationId: newAttestationId,
        transactionHash: transaction.receipt?.hash,
      });
    }
    throw new Error("No valid attestation data provided");
  } catch (e) {
    return handleError(e);
  }
}
