import React, {useMemo} from "react";
import i18n from "@dhis2/d2-i18n";
import {z} from "zod";
import {
    ApiDataStoreInfoPerProgram,
    FormattedEnrollmentDataStoreInfo
} from "../../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import {useDefaultValues} from "./hooks/useDefaultValues";
import {useForm, useWatch} from "react-hook-form";
import {Form} from "../../../ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormWidgetColumn} from "../FormComponents/FormWidgetColumn";
import {Button} from "../../../ui/button";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import {PluginSchema} from "../../EditFormFieldConfig/FormController";
import {Widgets} from "../Widgets.constants";
import {useValidateAndSave} from "./hooks/useValidateAndSave";
import {LoaderCircle} from "lucide-react";

type Props = {
    programId: string;
    record: z.infer<typeof FormattedEnrollmentDataStoreInfo> | undefined;
    page: "overview" | "newEvent" | "editEvent"
    allPlugins: Array<z.infer<typeof PluginSchema>>;
    onBack: () => void;
}

export const EditModePage = ({ programId, record, page, allPlugins, onBack }: Props) => {
    const { existingData } = useDefaultValues({ record, page });
    const { save, isSubmitting } = useValidateAndSave({ page, programId, onBack });
    const form = useForm<z.infer<typeof ApiDataStoreInfoPerProgram>>({
        resolver: zodResolver(ApiDataStoreInfoPerProgram),
        defaultValues: existingData,
    });
    const { leftColumn = [], rightColumn = [] } = useWatch({
        control: form.control,
    });

    const { availableWidgets, availablePlugins } = useMemo(() => {
        const usedWidgets = leftColumn.concat(rightColumn);
        const availableWidgets = Object.values(Widgets).filter(widget => {
            if (!widget.allowedPages.includes(page)) return false;
            return !usedWidgets
                .find(usedWidget => usedWidget.type === 'component' ?
                    usedWidget.name === widget.name
                    : false
                );
        });

        const availablePlugins = allPlugins.filter(plugin => {
            return !usedWidgets
                .find(usedWidget => usedWidget.type === 'plugin' ? usedWidget.source === plugin.pluginLaunchUrl : false);
        });

        return {
            availableWidgets,
            availablePlugins
        }
    }, [leftColumn, rightColumn, page, allPlugins]);

    const moveItemBetweenColumns = (
        values: z.infer<typeof ApiDataStoreInfoPerProgram>,
        sourceDroppableId: 'leftColumn' | 'rightColumn',
        destinationDroppableId: 'leftColumn' | 'rightColumn',
        sourceIndex: number,
        destinationIndex: number
    ) => {
        const sourceColumn = values[sourceDroppableId] ?? [];
        const destinationColumn = values[destinationDroppableId] ?? [];
        const [removed] = sourceColumn.splice(sourceIndex, 1);
        if (!removed) return;
        destinationColumn.splice(destinationIndex, 0, removed);
        return { sourceColumn, destinationColumn };
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const sourceDroppableId = result.source.droppableId as 'leftColumn' | 'rightColumn';
        const destinationDroppableId = result.destination.droppableId as 'leftColumn' | 'rightColumn';
        const values = form.getValues();

        // Move item between columns
        if (sourceDroppableId !== destinationDroppableId) {
            const {
                sourceColumn: newSourceColumn,
                destinationColumn: newDestinationColumn,
            } = moveItemBetweenColumns(
                values,
                sourceDroppableId,
                destinationDroppableId,
                result.source.index,
                result.destination.index
            ) ?? {};
            form.setValue(sourceDroppableId, newSourceColumn);
            form.setValue(destinationDroppableId, newDestinationColumn);
            return;
        }

        // Move item within the same column
        const column = values[sourceDroppableId] ?? [];
        const [removed] = column.splice(result.source.index, 1);
        if (!removed) return;
        column.splice(result.destination.index, 0, removed);
        form.setValue(sourceDroppableId, column);
    }

    return (
        <div>
            <Form
                {...form}
            >
                <form onSubmit={form.handleSubmit(save)}>
                    <div className={'flex justify-between mb-4'}>
                        <Button
                            onClick={onBack}
                            variant={'outline'}
                            size={'sm'}
                        >
                            {i18n.t('Cancel without saving')}
                        </Button>

                        <Button
                            type={'submit'}
                            size={'sm'}
                        >
                            {i18n.t('Save')}
                            {isSubmitting && (
                                <LoaderCircle
                                    className="h-4 w-4 ml-2 animate-spin"
                                />
                            )}
                        </Button>
                    </div>

                    <DragDropContext
                        onDragEnd={onDragEnd}
                    >
                        <div className={'flex gap-4'}>
                            <div className={'w-3/4'}>
                                <FormWidgetColumn
                                    columnName={'leftColumn'}
                                    availableWidgets={availableWidgets}
                                    availablePlugins={availablePlugins}
                                    allPlugins={allPlugins}
                                />
                            </div>

                            <div className={'w-1/4'}>
                                <FormWidgetColumn
                                    columnName={'rightColumn'}
                                    availableWidgets={availableWidgets}
                                    availablePlugins={availablePlugins}
                                    allPlugins={allPlugins}
                                />
                            </div>
                        </div>
                    </DragDropContext>
                </form>
            </Form>
        </div>
    )
}
