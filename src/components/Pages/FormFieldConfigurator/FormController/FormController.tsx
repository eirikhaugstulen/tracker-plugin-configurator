import React, { useMemo } from "react";
import i18n from '@dhis2/d2-i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { FormConfigurator } from "../FormConfigurator";
import { z } from "zod";
import { ConvertedMetadataSchema } from "../hooks/useMetadataFromType/Constants";
import { DragDropContext } from "react-beautiful-dnd";
import { PluginSchema, useFormFieldController } from "./hooks/useFormFieldController";
import { appsSchema } from "../hooks/useInstanceApps";
import { Button } from "../../../ui/button";
import { LoaderCircle } from "lucide-react";
import { useValidateAndSave } from "./hooks/useValidateAndSave";
import { usePluginConfigurations } from "../FormConfigurator/hooks/usePluginConfigurations";
import { FormFieldRecord } from "../../FormFieldPlugins/hooks/useFormFieldConfig";
import { toast } from "sonner";
import { PluginAdderComponent } from "../../../plugin-adder";

type Props = {
    metadata: z.infer<typeof ConvertedMetadataSchema>,
    formFieldId: string,
    apps: Array<z.infer<typeof appsSchema>>
    existingFormFieldConfig: FormFieldRecord | null | undefined,
}

const ValidationErrorToast = ({ errorMessage }: { errorMessage: string }) => {
    return (
        <div className={'flex flex-col gap-2'}>
            <h1>{i18n.t('Validation Error')}</h1>
            <div className={'rounded bg-red-50 border border-red-100 p-2 w-full'}>
                <p>{errorMessage}</p>
            </div>
        </div>
    )
}

export const FormController = ({ metadata, formFieldId, apps, existingFormFieldConfig }: Props) => {
    const availablePlugins = useMemo(() => {
        const filteredApps = apps.filter(app => app.pluginLaunchUrl);

        return filteredApps.map(app => ({
            id: app.key,
            displayName: app.name,
            description: app.description,
            pluginLaunchUrl: app.pluginLaunchUrl,
            version: app.version,
            type: 'PLUGIN' as const,
        })) as Array<z.infer<typeof PluginSchema>>;
    }, [apps])

    const {
        formFields,
        onDragEnd,
        onAddPlugin,
        onRemovePlugin,
        existingPluginConfigs,
    } = useFormFieldController({ metadata, availablePlugins, existingFormFieldConfig });

    const {
        pluginConfigurations,
        addPluginConfiguration,
    } = usePluginConfigurations({ existingPluginConfigs })

    const {
        validateAndSave,
        isSubmitting,
    } = useValidateAndSave({
        formFields,
        formFieldId,
        pluginConfigurations,
        onError: (e: string) => {
            toast.error(<ValidationErrorToast errorMessage={e} />)
        }
    });

    return (
        <>
            <div className={'flex w-full gap-2 justify-end'}>
                <PluginAdderComponent
                    plugins={availablePlugins}
                    onAddPlugin={onAddPlugin}
                />
                <Button
                    onClick={validateAndSave}
                    size={'sm'}
                >
                    {isSubmitting && <LoaderCircle className={'h-5 w-5 mr-2 animate-spin'} />}
                    {i18n.t('Save')}
                </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {metadata.displayName}
                        </CardTitle>
                        <CardDescription className={'mb-10'}>
                            {i18n.t('All fields you add here will be shown in the form')}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <FormConfigurator
                            formFields={formFields}
                            metadata={metadata}
                            addPluginConfiguration={addPluginConfiguration}
                            pluginConfigurations={pluginConfigurations}
                            onRemovePlugin={onRemovePlugin}
                        />
                    </CardContent>
                </Card>
            </DragDropContext>
        </>
    )
}
