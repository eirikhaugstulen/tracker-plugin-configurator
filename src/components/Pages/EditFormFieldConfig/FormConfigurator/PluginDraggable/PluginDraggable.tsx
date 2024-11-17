import {CrossIcon, GripVerticalIcon, SettingsIcon, TrashIcon, TriangleAlertIcon, XIcon} from "lucide-react";
import {Draggable} from "react-beautiful-dnd";
import React, {useState} from "react";
import i18n from '@dhis2/d2-i18n';
import {z} from "zod";
import {PluginSchema} from "../../FormController";
import {PluginDialogContent, PluginSettingSchema} from "./PluginDialogContent/PluginDialogContent";
import {Dialog} from "../../../../ui/dialog";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../../../../ui/tooltip";

type Props = {
    index: number,
    field: z.infer<typeof PluginSchema>,
    formFieldId: string,
    metadataType: 'program' | 'trackedEntityType',
    pluginConfiguration: z.infer<typeof PluginSettingSchema> | undefined,
    addPluginConfiguration: (id: string, configuration: z.infer<typeof PluginSettingSchema>) => void,
    onRemovePlugin: (pluginId: string) => void,
}

export const PluginDraggable = ({
    field,
    index,
    metadataType,
    formFieldId,
    pluginConfiguration,
    addPluginConfiguration,
    onRemovePlugin
}: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Draggable
            draggableId={field.id}
            index={index}
            key={field.id}
        >
            {(provided) => (
                <div
                    className={'w-full bg-white gap-2 py-2 px-4 mt-2 flex items-center cursor-grab select-none justify-between border rounded-sm'}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div>
                        <p className={'line-clamp-1'}>
                            {field.displayName}
                        </p>
                        <p className={'text-gray-500 min-h-5 line-clamp-1'}>
                            {field.description}
                        </p>
                    </div>
                    <div className={'flex gap-2'}>
                        <TooltipProvider>
                            <Tooltip delayDuration={50}>
                                <TooltipTrigger
                                    asChild
                                >
                                    <button
                                        onClick={() => setOpen(true)}
                                        className={'cursor-pointer transition-colors hover:bg-gray-100 rounded p-1'}
                                    >
                                        {pluginConfiguration ? (
                                            <SettingsIcon className={'h-4 w-4'}/>
                                        ) : (
                                            <TriangleAlertIcon className={'h-4 w-4 text-yellow-600'}/>
                                        )}

                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {i18n.t('Edit settings')}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip delayDuration={50}>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => onRemovePlugin(field.id)}
                                        className={'cursor-pointer transition-colors hover:bg-gray-100 rounded p-1'}
                                    >
                                        <XIcon className={'h-4 w-4'}/>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {i18n.t('Remove plugin')}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div
                            className={'p-1 cursor-grab'}
                        >
                            <GripVerticalIcon className={'h-4 w-4'}/>
                        </div>
                    </div>

                    <Dialog
                        open={open}
                        onOpenChange={setOpen}
                    >
                        {open && (
                            <PluginDialogContent
                                field={field}
                                formFieldId={formFieldId}
                                metadataType={metadataType}
                                setOpen={setOpen}
                                pluginConfiguration={pluginConfiguration}
                                addPluginConfiguration={addPluginConfiguration}
                            />
                        )}
                    </Dialog>
                </div>
            )}
        </Draggable>
    );
}
