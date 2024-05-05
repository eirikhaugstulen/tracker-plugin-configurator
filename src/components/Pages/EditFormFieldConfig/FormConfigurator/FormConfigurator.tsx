import React from 'react'
import {z} from "zod";
import {SectionSchema} from "../FormController";
import {Droppable} from "react-beautiful-dnd";
import {MetadataDraggable} from "./MetadataDraggable";
import {PluginDraggable} from "./PluginDraggable";
import {PluginSettingSchema} from "./PluginDraggable/PluginDialogContent";

type Props = {
    formFields: Array<z.infer<typeof SectionSchema>>,
    formFieldId: string,
    pluginConfigurations: Record<string, z.infer<typeof PluginSettingSchema>>,
    addPluginConfiguration: (id: string, configuration: z.infer<typeof PluginSettingSchema>) => void,
    metadataType: 'program' | 'trackedEntityType',
}

export const FormConfigurator = ({ formFields, formFieldId, metadataType, pluginConfigurations, addPluginConfiguration }: Props) => {
    return (
        <div className={'border-collapse space-y-4'}>
            {formFields.map(section => {
                return (
                    <Droppable droppableId={section.id} key={section.id}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={'w-full border rounded'}
                            >
                                <div className={'border-r border-b bg-sky-200/40 border-slate-300 w-fit px-2 py-1 text-sm'}>
                                    {section.displayName}
                                </div>

                                <div className={'px-2 py-4'}>
                                    {section.fields.map((field, index) => {
                                        if (field.type === 'PLUGIN') {
                                            return (
                                                <PluginDraggable
                                                    field={field}
                                                    index={index}
                                                    key={field.id}
                                                    formFieldId={formFieldId}
                                                    metadataType={metadataType}
                                                    pluginConfiguration={pluginConfigurations[field.id]}
                                                    addPluginConfiguration={addPluginConfiguration}
                                                />
                                            )
                                        }

                                        return (
                                            <MetadataDraggable
                                                field={field}
                                                index={index}
                                                key={field.id}
                                            />
                                        )
                                    })}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                )
            })}
        </div>
    )
}
