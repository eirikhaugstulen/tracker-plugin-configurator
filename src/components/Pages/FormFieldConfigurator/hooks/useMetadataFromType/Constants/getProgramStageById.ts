import { z } from "zod";
import { ConvertedMetadataSchema, FormField, FormSection, FunctionProps } from "./constants";

const ApiProgramStageSchema = z.object({
    id: z.string(),
    displayName: z.string(),
    access: z.object({
        read: z.boolean(),
        write: z.boolean(),
        data: z.object({
            read: z.boolean(),
            write: z.boolean(),
        }),
    }),
    programStageDataElements: z.array(z.object({
        dataElement: z.object({
            id: z.string(),
            displayName: z.string(),
            valueType: z.string(),
        }),
    })),
    programStageSections: z.array(z.object({
        id: z.string(),
        displayName: z.string(),
        sortOrder: z.number(),
        dataElements: z.array(z.object({
            id: z.string(),
            displayName: z.string(),
            valueType: z.string(),
        })),
    })),
});

const convert = (data: z.infer<typeof ApiProgramStageSchema>): z.infer<typeof ConvertedMetadataSchema> => {
    let sections: z.infer<typeof FormSection>[] = [];

    if (data.programStageSections.length > 0) {
        sections = data.programStageSections.map(section => ({
            id: section.id,
            displayName: section.displayName,   
            fields: section.dataElements.map(element => ({
                id: element.id,
                displayName: element.displayName,
                valueType: element.valueType,
            })),
        }))
    } else {
        sections = [{
            id: 'default',
            displayName: 'Default',
            fields: data.programStageDataElements.map(element => ({
                id: element.dataElement.id,
                displayName: element.dataElement.displayName,
                valueType: element.dataElement.valueType,
            })),
        }];
    }

    return {
        id: data.id,
        displayName: data.displayName,
        access: data.access,
        fields: data.programStageDataElements.reduce((acc: Record<string, z.infer<typeof FormField>>, element) => {
            acc[element.dataElement.id] = {
                id: element.dataElement.id,
                displayName: element.dataElement.displayName,
                valueType: element.dataElement.valueType,
            };
            return acc;
        }, {}),
        sections,
    };
};

export const getProgramStageById = async ({ resourceId, dataEngine }: FunctionProps) => {
    const fields = 'id,displayName,access[read,write,data[read,write]],programStageDataElements[dataElement[id,displayName,valueType]],programStageSections[id,displayName,sortOrder,dataElements[id,displayName,valueType]]';

    const { programStages }: any = await dataEngine.query({
        programStages: {
            resource: 'programStages',
            id: resourceId,
            params: {
                fields,
            },
        },
    });

    const programStage = ApiProgramStageSchema.parse(programStages);
    return convert(programStage);
};