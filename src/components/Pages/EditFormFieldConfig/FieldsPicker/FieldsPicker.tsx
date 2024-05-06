import React from "react";
import i18n from '@dhis2/d2-i18n';
import { Droppable, Draggable } from "react-beautiful-dnd";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../ui/card";
import {GripVerticalIcon} from "lucide-react";
import {z} from "zod";
import {PluginSchema} from "../FormController";

type Props = {
    plugins: Array<z.infer<typeof PluginSchema>>,
    nbInstalledPlugins: number,
}

export const FieldsPicker = ({ plugins, nbInstalledPlugins }: Props) => {
    return (
        <Card className={''}>
            <CardHeader>
                <CardTitle>
                    {i18n.t('Available plugins')}
                </CardTitle>
                <CardDescription>
                    {i18n.t('Drag and drop fields to add them to the form')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Droppable droppableId={'plugins-droppable'}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={'w-full min-h-20'}
                        >
                            {nbInstalledPlugins > 0 ? plugins.map((plugin, index) => (
                                <Draggable
                                    draggableId={plugin.id}
                                    index={index}
                                    key={plugin.id}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={'w-full bg-white py-2 px-4 my-1 flex items-center cursor-grab select-none justify-between border rounded-sm shadow'}
                                        >
                                            <div>
                                                <h2>
                                                    {plugin.displayName}
                                                </h2>
                                                <p className={'text-gray-500 min-h-6 line-clamp-1'}>
                                                    {plugin.description}
                                                </p>
                                            </div>
                                            <div className={'flex gap-2'}>
                                                <GripVerticalIcon className={'h-4 w-4'}/>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            )) : (
                                <div>
                                    {i18n.t('No plugins available')}
                                </div>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </CardContent>
        </Card>
    )
}
