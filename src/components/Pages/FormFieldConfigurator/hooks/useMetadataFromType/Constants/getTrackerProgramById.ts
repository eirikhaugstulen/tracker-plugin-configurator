import {ConvertedMetadataSchema, FormField, FunctionProps} from "./constants";
import {z} from "zod";

const ApiTrackerProgramSchema = z.object({
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

const convert = (data: z.infer<typeof ApiTrackerProgramSchema>): z.infer<typeof ConvertedMetadataSchema> => {
    let sections;

    if (data.programSections.length > 0) {
        sections = data.programSections
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(section => ({
            id: section.id,
            displayName: section.displayName,
            fields: section.trackedEntityAttributes.map(attribute => {
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
            }).filter((item): item is { id: string; displayName: string; valueType: string } => item !== null),
        }));
    } else {
        sections = [
            {
                id: 'default',
                displayName: 'Profile',
                fields: data.programTrackedEntityAttributes.map(attribute => ({
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
        fields: data.programTrackedEntityAttributes.reduce((acc: Record<string, z.infer<typeof FormField>>, attribute) => {
            acc[attribute.trackedEntityAttribute.id] = {
                id: attribute.trackedEntityAttribute.id,
                displayName: attribute.trackedEntityAttribute.displayName,
                valueType: attribute.trackedEntityAttribute.valueType,
            }
            return acc;
        }, {}),
        sections,
    });
}

export const getTrackerProgramById = async ({ resourceId, dataEngine }: FunctionProps) => {
    const fields = 'id,displayName,programTrackedEntityAttributes[sortOrder,trackedEntityAttribute[id,displayName,valueType]],access[read,write,data[read,write]],programSections[id,displayName,sortOrder,trackedEntityAttributes]';
    
    const { programs }: any = await dataEngine.query({
        programs: {
            resource: 'programs',
            id: resourceId,
            filter: 'programType:eq:WITH_REGISTRATION',
            params: {
                fields,
                pageSize: 1000,
            }
        }
    });

    const program = ApiTrackerProgramSchema.parse(programs) as z.infer<typeof ApiTrackerProgramSchema>;
    return convert(program);
}
