import { z } from "zod"
import { LinkBaseSchema } from "./link.dto"

export const CreateLinkSchema = LinkBaseSchema


export type CreateLinkDTO = z.infer<typeof CreateLinkSchema>;
