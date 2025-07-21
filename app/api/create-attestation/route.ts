import {
  AttestationPayload,
  EAS_SCHEMA_PAYLOAD_MULTI,
  SCHEMA_UID,
} from "@/utils/attestation-constants";
import { eas, encodeData, handleError } from "@/utils/attestation-utils";
import { NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { NextRequest, NextResponse } from "next/server";

const createAttestationData = (item: AttestationPayload) => {
  const { recipient, ...body } = item;
  return {
    recipient,
    expirationTime: NO_EXPIRATION,
    revocable: true,
    data: encodeData(body),
  };
};

const createSingleAttestation = async (data: AttestationPayload) => {
  const transaction = await eas.attest({
    schema: SCHEMA_UID,
    data: createAttestationData(data),
  });

  const newAttestationId = await transaction.wait();

  return {
    message: "Attestation created successfully",
    attestationId: newAttestationId,
    transactionHash: transaction.receipt?.hash,
  };
};

const createMultipleAttestations = async (dataArray: AttestationPayload[]) => {
  const transaction = await eas.multiAttest([
    {
      schema: SCHEMA_UID,
      data: dataArray.map(createAttestationData),
    },
  ]);

  const newAttestationId = await transaction.wait();

  return {
    message: "Multiple attestations created successfully",
    attestationId: newAttestationId,
    transactionHash: transaction.receipt?.hash,
  };
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const zodData = EAS_SCHEMA_PAYLOAD_MULTI.parse(data);
    if (!zodData || zodData.length === 0) {
      throw new Error("No valid attestation data provided");
    }
    const attestationData =
      zodData.length === 1
        ? await createSingleAttestation(zodData[0])
        : await createMultipleAttestations(zodData);
    return NextResponse.json(attestationData);
  } catch (e) {
    return handleError(e);
  }
}
