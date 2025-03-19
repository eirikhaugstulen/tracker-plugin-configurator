import {z} from "zod";
import {getTrackedEntityTypeById} from "./getTrackedEntityType";
import {getTrackerProgramById} from "./getTrackerProgramById";
import {getEventProgramById} from "./getEventProgramById";
import { MetadataTypes } from "../../../../FormFieldPlugins/hooks/useFormFieldConfig";
import { getProgramStageById } from "./getProgramStageById";

export type FunctionProps = {
    resourceId: string,
    dataEngine: any,
    programStageId?: string | null,
}

export const FormField = z.object({
    id: z.string(),
    displayName: z.string(),
    valueType: z.string(),
})

export const FormSection = z.object({
    id: z.string(),
    displayName: z.string(),
    fields: z.array(FormField),
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
    fields: z.record(z.string(), FormField),
    sections: z.array(FormSection),
});

export const FetchFunctionsByType = {
    [MetadataTypes.trackerProgram]: getTrackerProgramById,
    [MetadataTypes.eventProgram]: getEventProgramById,
    [MetadataTypes.trackedEntityType]: getTrackedEntityTypeById,
    [MetadataTypes.programStage]: getProgramStageById,
}
