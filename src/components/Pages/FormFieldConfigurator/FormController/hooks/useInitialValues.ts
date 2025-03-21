import {z} from "zod";
import {ConvertedMetadataSchema} from "../../hooks/useMetadataFromType/Constants";
import {FormFieldRecord} from "../../../FormFieldPlugins/hooks/useFormFieldConfig";
import {PluginSchema, SectionSchema} from "./useFormFieldController";
import { useMemo } from "react";
import {PluginSettingSchema} from "../../FormConfigurator/PluginDraggable/PluginDialogContent";

type Props = {
    metadata: z.infer<typeof ConvertedMetadataSchema>,
    availablePlugins: Array<z.infer<typeof PluginSchema>>
    existingFormFieldConfig: FormFieldRecord | null | undefined,
}

export const useInitialValues = ({ existingFormFieldConfig, availablePlugins, metadata }: Props) => {
    const initialValues = useMemo(() => {
        if (!existingFormFieldConfig) return metadata.sections.map(section => ({
            id: section.id,
            displayName: section.displayName,
            fields: section.fields.map(field => ({
                id: field.id,
                displayName: field.displayName,
                valueType: field.valueType,
                type: 'TrackedEntityAttribute' as const,
            }))
        }))

        return existingFormFieldConfig.sections.map(section => {
            const metadataSection = metadata.sections.find(metadataSection => metadataSection.id === section.id);
            if (!metadataSection) return null;

            const fields = section.elements.map(field => {
                if (field.type.toLowerCase() === 'plugin') {
                    const originalPluginId = field.id.split('_')[0];
                    const plugin = availablePlugins.find(plugin => plugin.id === originalPluginId);
                    
                    if (!plugin) {
                        return field.pluginSource ? ({
                            id: field.id,
                            pluginId: originalPluginId,
                            displayName: 'Local Plugin',
                            description: 'A plugin that is hosted locally',
                            pluginLaunchUrl: field.pluginSource,
                            version: '',
                            type: 'PLUGIN' as const,
                        }) : null;
                    }

                    return {
                        ...plugin,
                        id: field.id,
                        pluginId: plugin.id
                    };
                }

                const fieldMetadata = metadata.fields[field.id]
                if (!fieldMetadata) return null;

                return {
                    id: field.id,
                    displayName: fieldMetadata.displayName,
                    valueType: fieldMetadata.valueType,
                    type: 'TrackedEntityAttribute' as const,
                }
            }).filter(Boolean);

            return {
                id: section.id,
                displayName: metadataSection.displayName,
                fields,
            }
        }).filter(Boolean)
    }, []) as Array<z.infer<typeof SectionSchema>>;

    const existingPluginConfigs: Record<string, z.infer<typeof PluginSettingSchema>> = useMemo(() => {
        if (!existingFormFieldConfig) return {};

        return existingFormFieldConfig.sections.reduce((acc: Record<string, z.infer<typeof PluginSettingSchema>>, section) => {
            section.elements.forEach(element => {
                if (element.type.toLowerCase() === 'plugin') {
                    const originalPluginId = element.id.split('_')[0];
                    const plugin = availablePlugins.find(plugin => plugin.id === originalPluginId);
                    
                    if (!plugin) {
                        if (element.pluginSource) {
                            acc[element.id] = {
                                pluginLaunchUrl: element.pluginSource,
                                id: element.id,
                                fieldMap: element.fieldMap,
                            }
                        }
                        return acc;
                    }

                    acc[element.id] = {
                        pluginLaunchUrl: plugin.pluginLaunchUrl,
                        id: element.id,
                        fieldMap: element.fieldMap,
                    }
                }
            })

            return acc;
        }, {})
    }, []);

    return {
        initialValues,
        existingPluginConfigs
    }
}
