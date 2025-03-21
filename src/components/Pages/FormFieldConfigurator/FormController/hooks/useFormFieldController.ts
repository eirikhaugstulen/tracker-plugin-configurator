import {z} from "zod";
import {ConvertedMetadataSchema} from "../../hooks/useMetadataFromType/Constants";
import {useState} from "react";
import {DropResult} from "react-beautiful-dnd";
import {FormFieldRecord} from "../../../FormFieldPlugins/hooks/useFormFieldConfig";
import {useInitialValues} from "./useInitialValues";


export const PluginSchema = z.object({
    id: z.string(),
    pluginId: z.string().optional(),
    displayName: z.string(),
    pluginLaunchUrl: z.string(),
    description: z.string().optional(),
    version: z.string().optional(),
    type: z.literal('PLUGIN'),
})

export const NativeAttributeSchema = z.object({
    id: z.string(),
    displayName: z.string(),
    valueType: z.string(),
    type: z.literal('TrackedEntityAttribute'),
})

export const SectionSchema = z.object({
    id: z.string(),
    displayName: z.string(),
    fields: z.array(z.union([PluginSchema, NativeAttributeSchema])),
})

type Props = {
    metadata: z.infer<typeof ConvertedMetadataSchema>,
    availablePlugins: Array<z.infer<typeof PluginSchema>>
    existingFormFieldConfig: FormFieldRecord | null | undefined,
}

export const useFormFieldController = ({ metadata, availablePlugins, existingFormFieldConfig }: Props) => {
    const {
        initialValues,
        existingPluginConfigs
    } = useInitialValues({ metadata, availablePlugins, existingFormFieldConfig });
    const [formFields, setFormFields] = useState<z.infer<typeof SectionSchema>[]>(initialValues);

    const removePluginFromSection = (sectionId: string, pluginId: string) => {
        setFormFields(prev => prev.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    fields: section.fields.filter(field => field.id !== pluginId)
                }
            }
            return section;
        }))
    }

    const addPluginToSection = (sectionId: string, pluginId: string, index: number) => {
        // First try to find the plugin in the existing fields (for drag and drop)
        const existingPlugin = formFields.flatMap(section => section.fields).find(field => field.id === pluginId);
        
        if (existingPlugin && existingPlugin.type === 'PLUGIN') {
            // If we found an existing plugin, reuse it with its unique ID
            setFormFields(prev => prev.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        fields: [
                            ...section.fields.slice(0, index),
                            existingPlugin,
                            ...section.fields.slice(index)
                        ]
                    }
                }
                return section;
            }))
            return;
        }

        // If not found in existing fields, it's a new plugin being added
        const plugin = availablePlugins.find(plugin => plugin.id === pluginId);
        if (!plugin) return;

        const uniqueId = `${plugin.id}_${Date.now()}`;
        const pluginWithUniqueId = {
            ...plugin,
            id: uniqueId,
            pluginId: plugin.id
        };

        setFormFields(prev => prev.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    fields: [
                        ...section.fields.slice(0, index),
                        pluginWithUniqueId,
                        ...section.fields.slice(index)
                    ]
                }
            }
            return section;
        }))
    }

    const reorderSectionFields = (sectionId: string, fieldId: string, index: number) => {
        setFormFields(prev => prev.map(section => {
            if (section.id === sectionId) {
                // Find the field by its unique ID
                const field = section.fields.find(field => field.id === fieldId);
                if (!field) return section;

                // Filter out the field by its unique ID
                const filteredFields = section.fields.filter(field => field.id !== fieldId);
                return {
                    ...section,
                    fields: [
                        ...filteredFields.slice(0, index),
                        field, // Reuse the exact same field object to maintain its unique ID
                        ...filteredFields.slice(index)
                    ]
                }
            }
            return section;
        }))
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const sourceSectionId = result.source.droppableId;
        const destinationSectionId = result.destination.droppableId;

        if (sourceSectionId !== destinationSectionId) {
            removePluginFromSection(sourceSectionId, result.draggableId);
            addPluginToSection(destinationSectionId, result.draggableId, result.destination.index);
            return;
        }

        reorderSectionFields(sourceSectionId, result.draggableId, result.destination.index);
    }

    const onAddPlugin = (plugin: z.infer<typeof PluginSchema>) => {
        const uniqueId = `${plugin.id}_${Date.now()}`;
        const pluginWithUniqueId = {
            ...plugin,
            id: uniqueId,
            pluginId: plugin.id
        };

        setFormFields(prev => {
            const section = prev[0];
            if (!section) return prev;

            const newFields = [...section.fields, pluginWithUniqueId];
            return [
                {
                    ...section,
                    fields: newFields
                },
                ...prev.slice(1)
            ]
        })
    }

    const onRemovePlugin = (pluginId: string) => {
        setFormFields(prev => {
            return prev.map(section => ({
                ...section,
                fields: section.fields.filter(field => field.id !== pluginId)
            }))
        })
    }

    return {
        formFields,
        onAddPlugin,
        onRemovePlugin,
        onDragEnd,
        setFormFields,
        existingPluginConfigs
    }
}
