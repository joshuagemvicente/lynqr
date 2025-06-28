import { z } from "zod";
import { LinkBaseSchema } from "./link.dto";


export const UpdateLinkSchema = LinkBaseSchema

export type UpdateLinkDto = z.infer<typeof UpdateLinkSchema>