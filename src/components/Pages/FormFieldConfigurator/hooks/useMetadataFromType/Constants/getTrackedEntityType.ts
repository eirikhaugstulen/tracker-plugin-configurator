import {ConvertedMetadataSchema, FormField, FunctionProps} from "./constants";
import i18n from '@dhis2/d2-i18n';
import {z} from "zod";

const ApiTrackedEntityTypeSchema = z.object({
    id: z.string({ required_error: 'Tracked entity type id is missing in the API Payload. Please report the issue to the app maintainer.' }),
    displayName: z.string({ required_error: 'Tracked entity type display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
    trackedEntityTypeAttributes: z.array(z.object({
        trackedEntityAttribute: z.object({
            id: z.string({ required_error: 'Tracked entity type attribute id is missing in the API Payload. Please report the issue to the app maintainer.' }),
        }),
        displayName: z.string({ required_error: 'Tracked entity type attribute display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
        valueType: z.string({ required_error: 'Tracked entity type attribute value type is missing in the API Payload. Please report the issue to the app maintainer.' }),
    })),
    access: z.object({
        read: z.boolean({ required_error: 'Read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        write: z.boolean({ required_error: 'Write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        data: z.object({
            read: z.boolean({ required_error: 'Data read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
            write: z.boolean({ required_error: 'Data write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        }),
    }),
});

const convert = (data: z.infer<typeof ApiTrackedEntityTypeSchema>): z.infer<typeof ConvertedMetadataSchema> => ({
    id: data.id,
    displayName: data.displayName,
    access: data.access,
    fields: data.trackedEntityTypeAttributes.reduce((acc: Record<string, z.infer<typeof FormField>>, attribute) => {
        acc[attribute.trackedEntityAttribute.id] = {
            id: attribute.trackedEntityAttribute.id,
            displayName: attribute.displayName,
            valueType: attribute.valueType,
        }
        return acc;
    }, {}),
    sections: [
        {
            id: 'default',
            displayName: i18n.t('Profile'),
            fields: data.trackedEntityTypeAttributes.map((attribute: any) => ({
                id: attribute.trackedEntityAttribute.id,
                displayName: attribute.displayName,
                valueType: attribute.valueType,
            })),
        }
    ]
})

export const getTrackedEntityTypeById = async ({ resourceId, dataEngine }: FunctionProps) => {
    const fields = 'id,displayName,trackedEntityTypeAttributes[trackedEntityAttribute[id],displayName,valueType],access[read,write,data[read,write]]';
    const { trackedEntityTypes }: any = await dataEngine.query({
        trackedEntityTypes: {
            resource: 'trackedEntityTypes',
            id: resourceId,
            params: {
                fields,
                pageSize: 1000,
            }
        }
    });

    const trackedEntityType = ApiTrackedEntityTypeSchema.parse(trackedEntityTypes);
    return convert(trackedEntityType);
}
