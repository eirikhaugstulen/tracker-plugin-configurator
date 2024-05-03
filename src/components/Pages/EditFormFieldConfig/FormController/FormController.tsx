import React, {useMemo} from "react";
import i18n from '@dhis2/d2-i18n';
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "../../../ui/resizable";
import {Card, CardDescription, CardHeader, CardTitle} from "../../../ui/card";
import {FormConfigurator} from "../FormConfigurator";
import {FieldsPicker} from "../FieldsPicker/FieldsPicker";
import {z} from "zod";
import {ConvertedMetadataSchema} from "../hooks/useMetadataFromType/Constants";
import {DragDropContext} from "react-beautiful-dnd";
import {PluginSchema, useFormFieldController} from "./hooks/useFormFieldController";
import {appsSchema} from "../hooks/useInstanceApps";
import {Button} from "../../../ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../../../ui/dropdown-menu";
import {MoreVertical} from "lucide-react";
import {useValidateAndSave} from "./hooks/useValidateAndSave";
import {usePluginConfigurations} from "../FormConfigurator/hooks/usePluginConfigurations";

type Props = {
    metadata: z.infer<typeof ConvertedMetadataSchema>,
    formFieldId: string,
    metadataType: 'program' | 'trackedEntityType',
    apps: Array<z.infer<typeof appsSchema>>
}

export const FormController = ({ metadata, formFieldId, metadataType, apps }: Props) => {
    const availablePlugins: Array<z.infer<typeof PluginSchema>> = useMemo(() => {
        const filteredApps = apps.filter(app => app.pluginLaunchUrl);

        return filteredApps.map(app => ({
            id: app.key,
            displayName: app.name,
            description: app.description,
            pluginLaunchUrl: app.pluginLaunchUrl,
            version: app.version,
            type: 'PLUGIN',
        }))
    }, [])

    const {
        formFields,
        plugins,
        onDragEnd
    } = useFormFieldController({ metadata, availablePlugins });
    const {
        pluginConfigurations,
        addPluginConfiguration,
    } = usePluginConfigurations()

    const { validateAndSave } = useValidateAndSave({
        formFields,
        formFieldId,
        pluginConfigurations,
    });

    return (
        <>
            <div className={'flex w-full gap-2 justify-end'}>
                <Button
                    onClick={validateAndSave}
                >
                    {i18n.t('Save')}
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'outline'} size={'icon'}>
                            <MoreVertical className={'h-5 w-5'}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>{i18n.t('Import')}</DropdownMenuItem>
                        <DropdownMenuItem>{i18n.t('Validate')}</DropdownMenuItem>
                        <DropdownMenuItem>{i18n.t('Preview')}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <ResizablePanelGroup direction={'horizontal'}>
                    <ResizablePanel defaultSize={50}>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {metadata.displayName}
                                </CardTitle>
                                <CardDescription className={'mb-10'}>
                                    {i18n.t('All fields you add here will be shown in the form')}
                                </CardDescription>

                                <FormConfigurator
                                    formFields={formFields}
                                    formFieldId={formFieldId}
                                    metadataType={metadataType}
                                    addPluginConfiguration={addPluginConfiguration}
                                    pluginConfigurations={pluginConfigurations}
                                />
                            </CardHeader>
                        </Card>
                    </ResizablePanel>
                    <ResizableHandle className={'mx-3'} withHandle/>
                    <ResizablePanel defaultSize={50}>
                        <FieldsPicker
                            plugins={plugins}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </DragDropContext>
        </>
    )
}
