import {z} from "zod";
import {ConvertedMetadataSchema} from "../../hooks/useMetadataFromType/Constants";
import {useState} from "react";
import {DropResult} from "react-beautiful-dnd";


export const PluginSchema = z.object({
    id: z.string(),
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
}

export const useFormFieldController = ({ metadata, availablePlugins }: Props) => {
    const [formFields, setFormFields] = useState<z.infer<typeof SectionSchema>[]>(metadata.sections.map(section => ({
        id: section.id,
        displayName: section.displayName,
        fields: section.attributes.map(attribute => ({
            id: attribute.id,
            displayName: attribute.displayName,
            valueType: attribute.valueType,
            type: 'TrackedEntityAttribute',
        }))
    })));

    const [plugins, setPlugins] = useState<z.infer<typeof PluginSchema>[]>(availablePlugins);

    const removePluginFromSection = (sectionId: string, pluginId: string) => {
        // remove plugin from formFields
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

    const addPluginToPluginState = (pluginId: string, index: number) => {
        const plugin = availablePlugins.find(plugin => plugin.id === pluginId);
        if (!plugin) return;

        setPlugins(prev => [
            ...prev.slice(0, index),
            plugin,
            ...prev.slice(index)
        ])
    }

    const reorderPluginState = (pluginId: string, index: number) => {
        const plugin = availablePlugins.find(plugin => plugin.id === pluginId);
        if (!plugin) return;

        setPlugins(prev => {
            const filteredPlugins = prev.filter(plugin => plugin.id !== pluginId);
            return [
                ...filteredPlugins.slice(0, index),
                plugin,
                ...filteredPlugins.slice(index)
            ];
        });
    }

    const onRemovePluginFromState = (pluginId: string) => {
        setPlugins(prev => prev.filter(plugin => plugin.id !== pluginId))
    }

    const addPluginToSection = (sectionId: string, pluginId: string, index: number) => {
        const plugin = availablePlugins.find(plugin => plugin.id === pluginId);
        if (!plugin) return;

        setFormFields(prev => prev.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    fields: [
                        ...section.fields.slice(0, index),
                        plugin,
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
                const field = section.fields.find(field => field.id === fieldId);
                if (!field) return section;

                const filteredFields = section.fields.filter(field => field.id !== fieldId);
                return {
                    ...section,
                    fields: [
                        ...filteredFields.slice(0, index),
                        field,
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

        if (sourceSectionId === 'plugins-droppable') {
            if (destinationSectionId === 'plugins-droppable') {
                reorderPluginState(result.draggableId, result.destination.index);
                return;
            }
            const pluginId = result.draggableId;
            const index = result.destination.index;
            addPluginToSection(destinationSectionId, pluginId, index);
            onRemovePluginFromState(pluginId);
            return;
        }

        if (destinationSectionId === 'plugins-droppable') {
            const pluginId = result.draggableId;
            removePluginFromSection(sourceSectionId, pluginId);
            addPluginToPluginState(pluginId, result.destination.index);
            return;
        }

        if (sourceSectionId !== destinationSectionId) {
            removePluginFromSection(sourceSectionId, result.draggableId);
            addPluginToSection(destinationSectionId, result.draggableId, result.destination.index);
            return;
        }


        reorderSectionFields(sourceSectionId, result.draggableId, result.destination.index);
    }

    return {
        formFields,
        plugins,
        onDragEnd,
        setFormFields,
        setPlugins,
    }
}
