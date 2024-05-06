import React, {useEffect, useState} from "react";
import i18n from '@dhis2/d2-i18n';
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../../../../ui/dialog";
import {ScrollArea} from "../../../../../ui/scroll-area";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../../../../ui/accordion";
import {Button} from "../../../../../ui/button";
import {z} from "zod";
import {PluginSchema} from "../../../FormController";
import {useMetadataFromType} from "../../../hooks/useMetadataFromType/useMetadataFromType";
import {Input} from "../../../../../ui/input";
import {PluginTable} from "./Table";
import {Separator} from "../../../../../ui/separator";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../../../ui/form";
import {LoaderCircle, TriangleAlertIcon} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "../../../../../ui/alert";

type Props = {
    field: z.infer<typeof PluginSchema>,
    formFieldId: string,
    metadataType: 'program' | 'trackedEntityType',
    setOpen: (open: boolean) => void,
    pluginConfiguration: z.infer<typeof PluginSettingSchema> | undefined,
    addPluginConfiguration: (id: string, configuration: z.infer<typeof PluginSettingSchema>) => void,
}

type SelectedAttribute = {
    [IdFromApp: string]: string,
}

export const PluginSettingSchema = z.object({
    id: z.string().min(1, { message: i18n.t('Required') }),
    pluginLaunchUrl: z.string().min(1, { message: i18n.t('Required') }),
    fieldMap: z.array(z.object({
        IdFromApp: z.string(),
        IdFromPlugin: z.string(),
        type: z.literal('TrackedEntityAttribute')
    })),
});

export const PluginDialogContent = ({
    field,
    formFieldId,
    metadataType,
    setOpen,
    pluginConfiguration,
    addPluginConfiguration,
}: Props) => {
    const form = useForm<z.infer<typeof PluginSettingSchema>>({
        resolver: zodResolver(PluginSettingSchema),
        defaultValues: {
            pluginLaunchUrl: pluginConfiguration?.pluginLaunchUrl ?? field.pluginLaunchUrl,
            id: pluginConfiguration?.id ?? field.id,
            fieldMap: pluginConfiguration?.fieldMap ?? [],
        }
    })

    const onSubmit = async (values: z.infer<typeof PluginSettingSchema>) => {
        addPluginConfiguration(values.id, values);
        setOpen(false);
    }

    const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute>(
        pluginConfiguration?.fieldMap.reduce((acc, { IdFromApp, IdFromPlugin }) => {
        return {
            ...acc,
            [IdFromApp]: IdFromPlugin,
        }
    }, {}) ?? {});

    const { metadata} = useMetadataFromType({
        resourceId: formFieldId,
        metadataType,
    });

    const removeAttribute = (IdFromApp: string) => {
        setSelectedAttributes((prev) => {
            const copy = {...prev};
            delete copy[IdFromApp];
            return copy;
        })
    }

    const addAttribute = (IdFromApp: string, IdFromPlugin: string) => {
        setSelectedAttributes((prev) => {
            return {
                ...prev,
                [IdFromApp]: IdFromPlugin,
            }
        })
    }

    useEffect(() => {
        form.setValue('fieldMap', Object.entries(selectedAttributes).map(([IdFromApp, IdFromPlugin]) => {
            return {
                IdFromApp,
                IdFromPlugin,
                type: 'TrackedEntityAttribute',
            }
        }))
    }, [selectedAttributes])

    if (!metadata) {
        return null;
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {i18n.t('Plugin settings')}
                </DialogTitle>
                <DialogDescription>
                    {i18n.t('You are currently editing the settings for {{pluginName}}.', {
                        pluginName: field.displayName,
                    })}
                </DialogDescription>
            </DialogHeader>

            <div>
                <Separator className={'mb-4'} />
                <h2 className={'font-semibold'}>
                    {i18n.t('Attributes')}
                </h2>
                <p className={'text-gray-500 text-sm mb-1'}>
                    {i18n.t('Plugins are sandboxed and can only access the attributes you specify here.')}
                </p>
                <ScrollArea className={'h-80 rounded-md'}>
                    <PluginTable
                        selectedAttributes={selectedAttributes}
                        addAttribute={addAttribute}
                        removeAttribute={removeAttribute}
                        attributes={metadata.attributes}
                    />
                </ScrollArea>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <>
                        <Accordion type={'multiple'}>
                            <AccordionItem value={'Advanced'}>
                                <AccordionTrigger>
                                    {i18n.t('Advanced settings')}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Alert variant={'destructive'} className={'mb-5'}>
                                        <TriangleAlertIcon className={'h-5 w-5'} />
                                        <AlertTitle>
                                            {i18n.t('Danger zone')}
                                        </AlertTitle>
                                        <AlertDescription>
                                            {i18n.t('These settings may break the plugin if not set correctly.')}
                                        </AlertDescription>
                                    </Alert>

                                    <div className={'px-2'}>
                                        <FormField
                                            control={form.control}
                                            name="pluginLaunchUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{i18n.t('Plugin launch URL')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <DialogFooter className={'mt-4'}>
                            <Button
                                type="submit"
                            >
                                {i18n.t('Save')}
                                {form.formState.isSubmitting && <LoaderCircle className={'h-5 w-5 ml-2 animate-spin'} />}
                            </Button>
                        </DialogFooter>
                    </>
                </form>
            </Form>
        </DialogContent>
    )
}
