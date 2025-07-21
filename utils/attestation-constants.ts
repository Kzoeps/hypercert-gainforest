import { ethers } from "ethers";
import * as z from "zod";

export const EAS_CONTRACT_ADDRESS =
  "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
export const SCHEMA_UID =
  "0x3a65facf06635b21432225452ac5a5c00bc300c91ff6f940dc7244836f892616";
export const SCHEMA_PAYLOAD = z
  .object({
    title: z
      .string()
      .min(5, { message: "Title must be greater than 5 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must be greater than 10 characters" }),
    contributors: z
      .array(z.string())
      .nonempty({ message: "Contributors list cannot be empty" })
      .refine((addresses) => addresses.every((val) => ethers.isAddress(val)), {
        message: "All contributors must be valid Ethereum addresses",
      }),
    workStart: z
      .number()
      .int({ message: "workStart must be an integer" })
      .positive({ message: "workStart must be positive" }),
    workEnd: z
      .number()
      .int({ message: "workEnd must be an integer" })
      .positive({ message: "workEnd must be positive" }),
    recipient: z.string().refine((val) => ethers.isAddress(val), {
      message: "Recipient must be a valid Ethereum address",
    }),
  })
  .refine((data) => data.workEnd > data.workStart, {
    message: "Work end must be greater than work start",
    path: ["workEnd"],
  });
