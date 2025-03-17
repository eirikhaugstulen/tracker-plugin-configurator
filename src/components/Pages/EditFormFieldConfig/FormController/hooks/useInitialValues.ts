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
            fields: section.attributes.map(attribute => ({
                id: attribute.id,
                displayName: attribute.displayName,
                valueType: attribute.valueType,
                type: 'TrackedEntityAttribute' as const,
            }))
        }))

        return existingFormFieldConfig.sections.map(section => {
            const metadataSection = metadata.sections.find(metadataSection => metadataSection.id === section.id);
            if (!metadataSection) return null;

            const fields = section.elements.map(field => {
                if (field.type.toLowerCase() === 'plugin') {
                    const plugin = availablePlugins.find(plugin => plugin.id === field.id);
                    if (!plugin) {
                        return field.pluginSource ? ({
                            id: field.id,
                            displayName: 'Local Plugin',
                            description: 'A plugin that is hosted locally',
                            pluginLaunchUrl: field.pluginSource,
                            version: '',
                            type: 'PLUGIN' as const,
                        }) : null;
                    }

                    return plugin;
                }

                const attribute = metadata.attributes[field.id]
                if (!attribute) return null;

                return {
                    id: attribute.id,
                    displayName: attribute.displayName,
                    valueType: attribute.valueType,
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

        return existingFormFieldConfig.sections.reduce((acc, section) => {
            section.elements.forEach(element => {
                if (element.type.toLowerCase() === 'plugin') {
                    const plugin = availablePlugins.find(plugin => plugin.id === element.id);
                    if (!plugin) {
                        if (element.pluginSource) {
                            // @ts-ignore
                            acc[element.id] = {
                                pluginLaunchUrl: element.pluginSource,
                                id: element.id,
                                fieldMap: element.fieldMap,
                            }
                        }
                        return acc;
                    }

                    // @ts-ignore
                    acc[plugin.id] = {
                        pluginLaunchUrl: plugin.pluginLaunchUrl,
                        id: plugin.id,
                        fieldMap: element.fieldMap,
                }
            }})

            return acc;
        }, {})
    }, []);

    return {
        initialValues,
        existingPluginConfigs
    }
}
