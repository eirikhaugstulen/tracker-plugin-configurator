import {getTrackedEntityTypeById} from "./getTrackedEntityType";
import {getProgramsById} from "./getProgramsById";
import {z} from "zod";

export type FunctionProps = {
    resourceId: string,
    dataEngine: any,
}

export const FormAttribute = z.object({
    id: z.string(),
    displayName: z.string(),
    valueType: z.string(),
})

export const FormSection = z.object({
    id: z.string(),
    displayName: z.string(),
    attributes: z.array(z.object({
        id: z.string(),
        displayName: z.string(),
        valueType: z.string(),
    })),
})

export const ConvertedMetadataSchema = z.object({
    id: z.string({ coerce: true }).min(1),
    displayName: z.string(),
    access: z.object({
        read: z.boolean(),
        write: z.boolean(),
        data: z.object({
            read: z.boolean(),
            write: z.boolean(),
        }),
    }),
    attributes: z.record(z.string(), FormAttribute),
    sections: z.array(FormSection),
});

export const FetchFunctionsByType = {
    program: getProgramsById,
    trackedEntityType: getTrackedEntityTypeById,
}
