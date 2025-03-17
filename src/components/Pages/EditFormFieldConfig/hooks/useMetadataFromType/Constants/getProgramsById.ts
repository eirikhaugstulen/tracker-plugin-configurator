import {ConvertedMetadataSchema, FormAttribute, FunctionProps} from "./constants";
import {z} from "zod";

const ApiProgramSchema = z.object({
    id: z.string({ required_error: 'Tracked entity type id is missing in the API Payload. Please report the issue to the app maintainer.' }),
    displayName: z.string({ required_error: 'Tracked entity type display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
    programTrackedEntityAttributes: z.array(z.object({
        trackedEntityAttribute: z.object({
            id: z.string({ required_error: 'Tracked entity attribute id is missing in the API Payload. Please report the issue to the app maintainer.' }),
            displayName: z.string({ required_error: 'Tracked entity attribute display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
            valueType: z.string({ required_error: 'Tracked entity attribute value type is missing in the API Payload. Please report the issue to the app maintainer.' }),
        }),
    })),
    access: z.object({
        read: z.boolean({ required_error: 'Read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        write: z.boolean({ required_error: 'Write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        data: z.object({
            read: z.boolean({ required_error: 'Data read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
            write: z.boolean({ required_error: 'Data write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        }),
    }),
    programSections: z.array(z.object({
        id: z.string({ required_error: 'Program section id is missing in the API Payload. Please report the issue to the app maintainer.' }),
        displayName: z.string({ required_error: 'Program section display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
        sortOrder: z.number({ required_error: 'Program section sort order is missing in the API Payload. Please report the issue to the app maintainer.' }),
        trackedEntityAttributes: z.array(z.object({
            id: z.string({ required_error: 'Tracked entity attribute id is missing in the API Payload. Please report the issue to the app maintainer.' }),
        })),
    })),
});

// Schema for program stage data elements
const ApiProgramStageSchema = z.object({
    id: z.string({ required_error: 'Program stage id is missing in the API Payload. Please report the issue to the app maintainer.' }),
    displayName: z.string({ required_error: 'Program stage display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
    programStageDataElements: z.array(z.object({
        dataElement: z.object({
            id: z.string({ required_error: 'Data element id is missing in the API Payload. Please report the issue to the app maintainer.' }),
            displayName: z.string({ required_error: 'Data element display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
            valueType: z.string({ required_error: 'Data element value type is missing in the API Payload. Please report the issue to the app maintainer.' }),
        }),
    })),
    access: z.object({
        read: z.boolean({ required_error: 'Read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        write: z.boolean({ required_error: 'Write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        data: z.object({
            read: z.boolean({ required_error: 'Data read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
            write: z.boolean({ required_error: 'Data write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        }),
    }),
    programStageSections: z.array(z.object({
        id: z.string({ required_error: 'Program stage section id is missing in the API Payload. Please report the issue to the app maintainer.' }),
        displayName: z.string({ required_error: 'Program stage section display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
        sortOrder: z.number({ required_error: 'Program stage section sort order is missing in the API Payload. Please report the issue to the app maintainer.' }),
        dataElements: z.array(z.object({
            id: z.string({ required_error: 'Data element id is missing in the API Payload. Please report the issue to the app maintainer.' }),
        })),
    })).optional(),
});

const convert = (data: z.infer<typeof ApiProgramSchema>): z.infer<typeof ConvertedMetadataSchema> => {
    let sections;

    if (data.programSections.length > 0) {
        sections = data.programSections
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(section => ({
            id: section.id,
            displayName: section.displayName,
            attributes: section.trackedEntityAttributes.map(attribute => {
                const metadata = data.programTrackedEntityAttributes.find(meta => meta.trackedEntityAttribute.id === attribute.id);

                if (!metadata) {
                    console.error(`Metadata for attribute ${attribute.id} not found`);
                    return null;
                }

                return {
                    id: attribute.id,
                    displayName: metadata.trackedEntityAttribute.displayName,
                    valueType: metadata.trackedEntityAttribute.valueType,
                }
            }).filter(Boolean),
        }));
    } else {
        sections = [
            {
                id: 'default',
                displayName: 'Profile',
                attributes: data.programTrackedEntityAttributes.map(attribute => ({
                    id: attribute.trackedEntityAttribute.id,
                    displayName: attribute.trackedEntityAttribute.displayName,
                    valueType: attribute.trackedEntityAttribute.valueType,
                })),
            }
        ];
    }

    return ({
        id: data.id,
        displayName: data.displayName,
        access: data.access,
        attributes: data.programTrackedEntityAttributes.reduce((acc, attribute) => {
            acc[attribute.trackedEntityAttribute.id] = {
                id: attribute.trackedEntityAttribute.id,
                displayName: attribute.trackedEntityAttribute.displayName,
                valueType: attribute.trackedEntityAttribute.valueType,
            }
            return acc;
        }, {} as Record<string, z.infer<typeof FormAttribute>>),
        // @ts-ignore
        sections,
    });
}

// Convert program stage data to the same format
const convertProgramStage = (data: z.infer<typeof ApiProgramStageSchema>): z.infer<typeof ConvertedMetadataSchema> => {
    const attributes: Record<string, z.infer<typeof FormAttribute>> = {};

    data.programStageDataElements.forEach(element => {
        attributes[element.dataElement.id] = {
            id: element.dataElement.id,
            displayName: element.dataElement.displayName,
            valueType: element.dataElement.valueType,
        }
    });

    const sections = [];

    // If program stage has sections
    if (data.programStageSections && data.programStageSections.length > 0) {
        const stageSectionsSorted = [...data.programStageSections].sort((a, b) => a.sortOrder - b.sortOrder);

        for (const section of stageSectionsSorted) {
            const sectionAttributes = [];

            for (const elementRef of section.dataElements) {
                const element = data.programStageDataElements.find(
                    de => de.dataElement.id === elementRef.id
                );

                if (!element) continue;

                sectionAttributes.push({
                    id: element.dataElement.id,
                    displayName: element.dataElement.displayName,
                    valueType: element.dataElement.valueType,
                });
            }

            if (sectionAttributes.length) {
                sections.push({
                    id: section.id,
                    displayName: section.displayName,
                    attributes: sectionAttributes,
                });
            }
        }
    }
    // If program stage doesn't have sections, create a default one
    else {
        const defaultSectionAttributes = data.programStageDataElements.map(
            element => ({
                id: element.dataElement.id,
                displayName: element.dataElement.displayName,
                valueType: element.dataElement.valueType,
            })
        );

        sections.push({
            id: 'default',
            displayName: 'Default',
            attributes: defaultSectionAttributes,
        });
    }

    return {
        id: data.id,
        displayName: data.displayName,
        access: data.access,
        attributes,
        sections,
    };
}

export const getProgramsById = async ({ resourceId, dataEngine, programStageId }: FunctionProps) => {
    // If we have a program stage ID, fetch program stage data
    // Note: This only applies to tracker programs (WITH_REGISTRATION)
    if (programStageId) {
        const fields = 'id,displayName,programStageDataElements[dataElement[id,displayName,valueType]],access[read,write,data[read,write]],programStageSections[id,displayName,sortOrder,dataElements]';
        const { programStage }: any = await dataEngine.query({
            programStage: {
                resource: 'programStages',
                id: programStageId,
                params: {
                    fields,
                }
            }
        });

        const stage = ApiProgramStageSchema.parse(programStage) as z.infer<typeof ApiProgramStageSchema>;
        return convertProgramStage(stage);
    }
    
    // Otherwise fetch program data (this works for both tracker and event programs)
    const fields = 'id,displayName,programTrackedEntityAttributes[sortOrder,trackedEntityAttribute[id,displayName,valueType]],access[read,write,data[read,write]],programSections[id,displayName,sortOrder,trackedEntityAttributes]';
    const { programs }: any = await dataEngine.query({
        programs: {
            resource: 'programs',
            id: resourceId,
            params: {
                fields,
                pageSize: 1000,
            }
        }
    });

    const program = ApiProgramSchema.parse(programs) as z.infer<typeof ApiProgramSchema>;
    return convert(program);
}
