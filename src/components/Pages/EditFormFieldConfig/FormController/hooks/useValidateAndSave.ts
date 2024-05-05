import {z} from "zod";
import i18n from "@dhis2/d2-i18n";
import {SectionSchema} from "./useFormFieldController";
import {PluginSettingSchema} from "../../FormConfigurator/PluginDraggable/PluginDialogContent/PluginDialogContent";
import {useSaveFormConfig} from "./useSaveFormConfig";
import {useQueryClient} from "@tanstack/react-query";

const TrackedEntityAttributeSchema = z.object({
    id: z.string().min(1, { message: 'Missing id' }),
    type: z.literal('TrackedEntityAttribute'),
});

const PluginFieldMapSchema = z.object({
    IdFromApp: z.string().min(1, { message: 'Missing IdFromApp' }),
    IdFromPlugin: z.string().min(1, { message: 'Missing IdFromPlugin' }),
    objectType: z.literal('TrackedEntityAttribute'),
});

const PluginElementSchema = z.object({
    id: z.string(),
    type: z.literal('plugin'),
    pluginSource: z.string().min(1, { message: 'Missing plugin source' }),
    fieldMap: z.array(PluginFieldMapSchema),
});

export const ContextFormSchema = z.array(z.object({
    id: z.string(),
    elements: z.array(z.union([PluginElementSchema, TrackedEntityAttributeSchema])),
}));

const DataFormSchema = z.record(z.string(), ContextFormSchema);

type Props = {
    formFields: Array<z.infer<typeof SectionSchema>>,
    formFieldId: string,
    pluginConfigurations: Record<string, z.infer<typeof PluginSettingSchema>>,
}

export const useValidateAndSave = ({ formFields, formFieldId, pluginConfigurations }: Props) => {
    const queryClient = useQueryClient();
    const { saveFormConfig } = useSaveFormConfig();

    const buildPayloadForCurrentContext = (): Record<string, z.infer<typeof ContextFormSchema>> => {
        const currentContextPayload = formFields.map(section => {
            return {
                id: section.id,
                elements: section.fields.map(field => {
                    if (field.type === 'PLUGIN') {
                        const pluginConfiguration = pluginConfigurations[field.id];
                        if (!pluginConfiguration) throw new Error('Missing plugin configuration');
                        return {
                            id: field.id,
                            type: 'plugin' as const,
                            pluginSource: pluginConfiguration.pluginLaunchUrl,
                            fieldMap: pluginConfiguration.fieldMap.map(fieldMap => {
                                return {
                                    IdFromApp: fieldMap.IdFromApp,
                                    IdFromPlugin: fieldMap.IdFromPlugin,
                                    objectType: 'TrackedEntityAttribute' as const,
                                }
                            })
                        }
                    }

                    else if (field.type === 'TrackedEntityAttribute') {
                        return {
                            id: field.id,
                            type: 'TrackedEntityAttribute' as const,
                        }
                    }

                    throw new Error('Unknown field type');
                })
            }
        });

        return {
            [formFieldId]: currentContextPayload,
        }
    }
    const validate = (payload: unknown): Record<string, z.infer<typeof ContextFormSchema>> => {
        const result = DataFormSchema.safeParse(payload);
        if (!result.success) {
            console.error('Validation error: ', result.error);
            throw new Error(i18n.t('There is an error with the provided data'));
        }
        return result.data;
    }

    const save = (contextPayload: Record<string, z.infer<typeof ContextFormSchema>>) => {
        const data = queryClient.getQueryData<{
            formFieldConfigQuery: Record<string,
                z.infer<typeof ContextFormSchema>>,
        }>(['formFieldConfig']);

        if (!data) {
            throw new Error('Missing previous data from data store');
        }

        const { formFieldConfigQuery } = data;

        const updatedData = {
            ...formFieldConfigQuery,
            ...contextPayload,
        }

        saveFormConfig(updatedData);
    }

    const validateAndSave = async () => {
        const dataStorePayload = buildPayloadForCurrentContext();
        const validatedData = validate(dataStorePayload);
        save(validatedData);
    }

    return {
        validate,
        save,
        validateAndSave,
    }
}
