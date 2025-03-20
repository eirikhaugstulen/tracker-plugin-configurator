import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { z } from "zod";
import { SettingsSchema } from "../../Widgets.constants";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "../../../../ui/dialog";
import { useFormContext } from 'react-hook-form';
import { Label } from '../../../../ui/label';
import { Switch } from '../../../../ui/switch';
import { Input } from '../../../../ui/input';
import { Button } from "../../../../ui/button";
import { FormDescription } from '../../../../ui/form';
import { FormItem, FormLabel, FormControl } from '../../../../ui/form';
import { SettingsIcon } from "lucide-react";

// Type for column items
interface ColumnItem {
    type: 'component' | 'plugin';
    name?: string;
    source?: string;
    settings?: Record<string, any>;
}

interface SettingsDialogProps {
    title: string;
    description?: string;
    draggableId: string;
    settings?: z.infer<typeof SettingsSchema>;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
    title,
    description,
    draggableId,
    settings
}) => {
    const { getValues, setValue } = useFormContext();

    const getComponentPath = () => {
        const values = getValues();

        // Check both columns to find the component
        const leftColumnIndex = values.leftColumn?.findIndex((item: ColumnItem) =>
            (item.type === 'component' && item.name === draggableId) ||
            (item.type === 'plugin' && item.source === draggableId)
        );

        if (leftColumnIndex !== -1 && leftColumnIndex !== undefined) {
            return {
                columnName: 'leftColumn',
                index: leftColumnIndex
            };
        }

        const rightColumnIndex = values.rightColumn?.findIndex((item: ColumnItem) =>
            (item.type === 'component' && item.name === draggableId) ||
            (item.type === 'plugin' && item.source === draggableId)
        );

        if (rightColumnIndex !== -1 && rightColumnIndex !== undefined) {
            return {
                columnName: 'rightColumn',
                index: rightColumnIndex
            };
        }

        return null;
    };

    const getCurrentSettings = () => {
        const componentPath = getComponentPath();
        if (!componentPath) return {};

        const { columnName, index } = componentPath;
        const component = getValues()[columnName][index];

        return component.settings || {};
    };

    const updateSettings = (newSettings: Record<string, any>) => {
        const componentPath = getComponentPath();
        if (!componentPath) return;

        const { columnName, index } = componentPath;
        setValue(`${columnName}.${index}.settings`, newSettings);
    };

    const renderSettingField = (key: string, setting: any) => {
        const currentSettings = getCurrentSettings();
        const currentValue = currentSettings[key];

        switch (setting.valueType) {
            case 'boolean':
                return (
                    <div key={key}>
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    {setting.label}
                                </FormLabel>
                                {setting.description && (
                                    <FormDescription className="text-sm">
                                        {setting.description}
                                    </FormDescription>
                                )}
                            </div>
                            <FormControl>
                                <Switch
                                    id={key}
                                    checked={currentValue || false}
                                    onCheckedChange={(checked) => {
                                        const newSettings = { ...currentSettings, [key]: checked };
                                        updateSettings(newSettings);
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    </div>
                );

            case 'string':
                return (
                    <div className="space-y-2" key={key}>
                        <Label htmlFor={key}>{setting.label}</Label>
                        <Input
                            id={key}
                            value={currentValue || ''}
                            onChange={(e) => {
                                const newSettings = { ...currentSettings, [key]: e.target.value };
                                updateSettings(newSettings);
                            }}
                        />
                        {setting.description && (
                            <FormDescription>
                                {setting.description}
                            </FormDescription>
                        )}
                    </div>
                );

            case 'number':
                return (
                    <div className="space-y-2" key={key}>
                        <Label htmlFor={key}>{setting.label}</Label>
                        <Input
                            id={key}
                            type="number"
                            value={currentValue || 0}
                            onChange={(e) => {
                                const newSettings = { ...currentSettings, [key]: Number(e.target.value) };
                                updateSettings(newSettings);
                            }}
                        />
                        {setting.description && (
                            <FormDescription>
                                {setting.description}
                            </FormDescription>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (!settings) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'ghost'}
                    type={'button'}
                    size={'sm'}
                >
                    <SettingsIcon
                        className={'h-4 w-4 cursor-pointer'}
                    />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title} {i18n.t('Settings')}
                    </DialogTitle>
                    {description && (
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {Object.entries(settings).map(([key, setting]) =>
                        renderSettingField(key, setting)
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button>
                            {i18n.t('Close')}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 