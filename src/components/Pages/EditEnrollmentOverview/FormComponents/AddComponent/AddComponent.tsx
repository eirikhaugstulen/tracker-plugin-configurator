import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../../../../ui/sheet";
import { PlusCircleIcon } from "lucide-react";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Separator } from "../../../../ui/separator";
import { NativeWidgetSchema, Widgets } from "../../Widgets.constants";
import { z } from "zod";
import { PluginSchema } from "../../../FormFieldConfigurator/FormController";
import { Button } from "../../../../ui/button";
import { ApiDataStoreInfoPerProgram } from "../../../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import { useFormContext } from "react-hook-form";
import { LocalPluginForm } from "./LocalPluginForm";
import { DefaultPageLayout } from "../../EditModePage/hooks/useDefaultValues";
import { WidgetTypes } from "../../EditModePage/hooks/useDefaultValues";

type Props = {
    columnName: 'leftColumn' | 'rightColumn'
    availableWidgets: Array<z.infer<typeof NativeWidgetSchema>>,
    availablePlugins: Array<z.infer<typeof PluginSchema>>,
    allPlugins: Array<z.infer<typeof PluginSchema>>;
    page: 'overview' | 'newEvent' | 'editEvent';
}

export const AddComponent = ({ columnName, availablePlugins, availableWidgets, allPlugins, page }: Props) => {
    const [open, setOpen] = useState(false);
    const {
        setValue,
        getValues,
    } = useFormContext<z.infer<typeof ApiDataStoreInfoPerProgram>>();
    const visiblePlugins = availablePlugins;
    const visibleWidgets = availableWidgets;

    const handleLocalPluginSubmit = (pluginUrl: string) => {
        const pluginMetadata = {
            id: pluginUrl,
            displayName: 'Local Plugin',
            description: 'A plugin that is hosted locally',
            pluginLaunchUrl: pluginUrl,
            type: 'PLUGIN' as const,
        };

        addPluginToColumn({ id: pluginMetadata.id, pluginLaunchUrl: pluginMetadata.pluginLaunchUrl });
    };

    const addComponentToColumn = (componentName: string) => {
        const values = getValues();
        const column = values[columnName] ?? [];
        const newValues = [...column];

        const widget = Widgets[componentName as keyof typeof Widgets];
        if (!widget) return;

        // Get the default settings for this page
        const defaultPageLayout = DefaultPageLayout[page];
        const defaultComponent = defaultPageLayout[columnName]?.find(
            (item: { type: 'plugin'; source: string; settings?: Record<string, any> } | { type: 'component'; name: string; settings?: Record<string, any> }) =>
                item.type === WidgetTypes.COMPONENT && 'name' in item && item.name === componentName
        );

        newValues.unshift({
            type: 'component',
            name: widget.name,
            settings: defaultComponent?.settings ?? widget.settings,
        });

        setValue(columnName, newValues);
        setOpen(false);
    }

    const addPluginToColumn = ({ id, pluginLaunchUrl }: { id: string, pluginLaunchUrl: string }) => {
        const values = getValues();
        const column = values[columnName] ?? [];
        const newValues = [...column];
        const pluginMetadata = allPlugins.find(plugin => plugin.id === id);

        if (!pluginMetadata) {
            newValues.unshift({
                type: 'plugin',
                source: pluginLaunchUrl,
            });
        } else {
            newValues.unshift({
                type: 'plugin',
                source: pluginMetadata.pluginLaunchUrl,
            });
        }

        setValue(columnName, newValues);
        setOpen(false);
    }

    return (
        <div>
            <Sheet
                open={open}
                onOpenChange={setOpen}
            >
                <SheetTrigger asChild>
                    <button
                        aria-label={i18n.t('Add widget')}
                        className={'border w-full border-dashed border-gray-200 py-6 flex flex-col gap-2 justify-center items-center cursor-pointer hover:border-gray-300'}
                    >
                        <PlusCircleIcon className={'h-8 w-8 mx-auto text-gray-400'} />
                        <p className={'text-center text-gray-600'}>
                            {i18n.t('Add')}
                        </p>
                    </button>
                </SheetTrigger>

                <SheetContent className="flex h-dvh max-h-dvh flex-col overflow-hidden p-0 sm:max-w-md">
                    <SheetHeader className="shrink-0 border-b px-6 pb-4 pr-12 pt-6">
                        <SheetTitle>{i18n.t('Add widget')}</SheetTitle>
                        <SheetDescription>
                            {i18n.t('Add a widget from the list below to add it to the column')}
                        </SheetDescription>
                    </SheetHeader>

                    <ScrollArea className={'min-h-0 flex-1'}>
                        <div className={'px-6 py-4 pr-8'}>
                            <h2 className={'my-2'}>{i18n.t('Add Local Plugin')}</h2>
                            <Separator className={'mb-4'} />

                            <LocalPluginForm onSubmit={handleLocalPluginSubmit} />

                            <h2 className={'mt-6 mb-2'}>{i18n.t('Available Plugins')}</h2>
                            <Separator className={'mb-4'} />


                            {visiblePlugins.length ? visiblePlugins.map(plugin => (
                                <div key={plugin.id} className={'border space-y-4 p-4 rounded mt-2 bg-white'}>
                                    <div className={'space-y-1'}>
                                        <p>{plugin.displayName}</p>
                                        <p className={'text-gray-600'}>{plugin.description}</p>
                                    </div>
                                    <Button
                                        onClick={() => addPluginToColumn({ id: plugin.id, pluginLaunchUrl: plugin.pluginLaunchUrl })}
                                    >
                                        {i18n.t('Add')}
                                    </Button>
                                </div>
                            )) : (
                                <div className={'text-sm mt-4 mb-10 text-gray-600 italic'}>
                                    {i18n.t('There are no more plugins available on your instance. You can upload plugins in the app management application, or download from the DHIS2 App Hub')}
                                </div>
                            )}

                            <h2 className={'mt-4 mb-2'}>{i18n.t('Widgets')}</h2>
                            <Separator className={'mb-4'} />
                            {visibleWidgets.length > 0 ? visibleWidgets.map((widget, index) => (
                                <div key={`${widget.name}-${index}`} className={'border p-4 space-y-4 rounded mt-2 bg-white'}>
                                    <p>{widget.title}</p>
                                    <Button
                                        onClick={() => addComponentToColumn(widget.name)}
                                    >
                                        {i18n.t('Add')}
                                    </Button>
                                </div>
                            )) : (
                                <div className={'text-sm mt-4 mb-10 text-gray-600 italic'}>
                                    {i18n.t('There are no more widgets available for this page.')}
                                </div>

                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    )
}
