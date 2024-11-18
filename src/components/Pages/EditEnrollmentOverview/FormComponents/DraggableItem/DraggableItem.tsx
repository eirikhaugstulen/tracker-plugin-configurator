import React, {useState} from 'react';
import i18n from '@dhis2/d2-i18n';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from "../../../../ui/button";
import {GripVerticalIcon, InfoIcon, SettingsIcon, XIcon} from "lucide-react";
import {z} from "zod";
import {SettingsSchema} from "../../Widgets.constants";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../../../../ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../ui/tooltip';

type DraggableItemProps = {
    draggableId: string;
    index: number;
    title: string;
    description?: string;
    removeComponent: (id: string) => void;
    settings?: z.infer<typeof SettingsSchema>;
    missingMetadata?: boolean;
};

export const DraggableItem: React.FC<DraggableItemProps> = (
    {
        draggableId,
        index,
        title,
        description,
        settings,
        removeComponent,
        missingMetadata,
    }) => {
    const [open, setOpen] = useState(false);

    return (
        <Draggable draggableId={draggableId} key={draggableId} index={index}>
            {(provided) => (
                <div
                    className={'border flex justify-between items-center p-4 min-h-24 bg-white rounded mt-2'}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className={'p-1 cursor-grab'}>
                        <GripVerticalIcon className={'h-4 w-4'}/>
                    </div>
                    <div className={'w-full flex flex-col gap-2'}>
                        <p className={'truncate'}>
                            {title}
                        </p>

                    </div>
                    <div className={'flex items-center gap-2'}>
                        {missingMetadata && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger
                                        asChild
                                        type={'button'}
                                    >
                                        <InfoIcon className={'h-4 w-4'}/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {i18n.t('Missing plugin metadata. Safe to ignore for local plugins, otherwise please reconfigure.')}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {settings && (
                            <Button
                                className={'hidden'}
                                variant={'ghost'}
                                type={'button'}
                                size={'sm'}
                            >
                                <SettingsIcon
                                    className={'h-4 w-4 cursor-pointer'}
                                    onClick={() => setOpen(true)}
                                />
                            </Button>
                        )}
                        <Button
                            size={'sm'}
                            type={'button'}
                            variant={'ghost'}
                            onClick={() => removeComponent(draggableId)}
                        >
                            <XIcon className={'h-4 w-4'}/>
                        </Button>
                    </div>

                    {settings && false && (
                        <Dialog
                            open={open}
                            onOpenChange={setOpen}
                        >
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {title}
                                    </DialogTitle>
                                    {description && (
                                        <DialogDescription>
                                            {description}
                                        </DialogDescription>
                                    )}
                                </DialogHeader>

                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            )}
        </Draggable>
    );
};
