import { z } from "zod";
import { FunctionProps, ConvertedMetadataSchema, FormField } from "./constants";


const ApiEventProgramSchema = z.object({
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
    programStages: z.array(z.object({
        id: z.string(),
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
            })),
        })),
    })),
});

const convert = (data: z.infer<typeof ApiEventProgramSchema>): z.infer<typeof ConvertedMetadataSchema> => {
    // There should only be one program stage in event programs
    const programStage = data.programStages[0];

    if (!programStage) {
        throw new Error('No program stage found in event program');
    }

    const fields = programStage.programStageDataElements.reduce<Record<string, z.infer<typeof FormField>>>((acc, element) => {
        acc[element.dataElement.id] = {
            id: element.dataElement.id,
            displayName: element.dataElement.displayName,
            valueType: element.dataElement.valueType,
        };
        return acc;
    }, {});

    let sections: z.infer<typeof ConvertedMetadataSchema>['sections'] = [];

    if (programStage.programStageSections.length > 0) {
        sections = programStage.programStageSections.map(section => ({
            id: section.id,
            displayName: section.displayName,
            fields: section
                .dataElements.map(element => fields[element.id])
                .filter((field): field is z.infer<typeof FormField> => field !== undefined),
        }));
    } else {
        sections = [
            {
                id: 'default',
                displayName: 'Default',
                fields: Object.values(fields),
            }
        ];
    }

    return {
        id: data.id,
        displayName: data.displayName,
        access: data.access,
        fields,
        sections,
    };
}

export const getEventProgramById = async ({ resourceId, dataEngine }: FunctionProps) => {
    const fields = 'id,displayName,access[read,write,data[read,write]],programStages[id,programStageDataElements[dataElement[id,displayName,valueType]],programStageSections[id,displayName,sortOrder,dataElements[id]]]';
    const { programs }: any = await dataEngine.query({
        programs: {
            resource: 'programs',
            id: resourceId,
            params: {
                fields,
            }
        }
    });

    const program = ApiEventProgramSchema.parse(programs);
    return convert(program);
}