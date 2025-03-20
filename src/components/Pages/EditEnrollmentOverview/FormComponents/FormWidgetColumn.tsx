import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ApiColumnSchema, ApiDataStoreInfoPerProgram } from "../../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import { z } from "zod";
import { WidgetTypes } from "../EditModePage/hooks/useDefaultValues";
import { Droppable } from "react-beautiful-dnd";
import { NativeWidgetSchema, Widgets } from "../Widgets.constants";
import { AddComponent } from "./AddComponent";
import { PluginSchema } from "../../FormFieldConfigurator/FormController";
import { DraggableItem } from "./DraggableItem";

type Props = {
    columnName: 'leftColumn' | 'rightColumn'
    availableWidgets: Array<z.infer<typeof NativeWidgetSchema>>,
    availablePlugins: Array<z.infer<typeof PluginSchema>>,
    allPlugins: Array<z.infer<typeof PluginSchema>>;
    page: 'overview' | 'newEvent' | 'editEvent';
}

export const FormWidgetColumn = ({ columnName, availableWidgets, availablePlugins, allPlugins, page }: Props) => {
    const { control, setValue } = useFormContext();
    const columnContents: z.infer<typeof ApiColumnSchema> = useWatch<z.infer<typeof ApiDataStoreInfoPerProgram>>({
        control,
        name: columnName,
    })

    const removeComponentFromColumn = (componentName: string) => {
        const currentValues = [...columnContents];

        const newValues = currentValues.filter((value) => {
            if (value.type === WidgetTypes.COMPONENT) {
                return value.name !== componentName;
            }
            return value.source !== componentName;
        });

        setValue(columnName, newValues);
    }

    return (
        <div>
            <AddComponent
                columnName={columnName}
                availableWidgets={availableWidgets}
                availablePlugins={availablePlugins}
                allPlugins={allPlugins}
                page={page}
            />

            <Droppable
                droppableId={columnName}
            >
                {(provided) => (
                    <div
                        className={'min-h-24'}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {columnContents.map((column, index) => {
                            const key = column.type === WidgetTypes.COMPONENT ? column.name : column.source;

                            if (column.type === WidgetTypes.COMPONENT) {
                                if (!(column.name in Widgets)) return null;
                                const columnMetadata = Widgets[column.name as keyof typeof Widgets]!;
                                return (
                                    <DraggableItem
                                        key={key}
                                        draggableId={key}
                                        index={index}
                                        title={columnMetadata.title}
                                        description={columnMetadata.description}
                                        removeComponent={removeComponentFromColumn}
                                        settings={columnMetadata.settings}
                                    />
                                )
                            }

                            const pluginMetadata = allPlugins.find(plugin => plugin.pluginLaunchUrl === column.source);

                            return (
                                <DraggableItem
                                    key={key}
                                    draggableId={key}
                                    index={index}
                                    title={pluginMetadata?.displayName ?? 'Local or unknown plugin'}
                                    removeComponent={removeComponentFromColumn}
                                    missingMetadata={!pluginMetadata}
                                />
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
