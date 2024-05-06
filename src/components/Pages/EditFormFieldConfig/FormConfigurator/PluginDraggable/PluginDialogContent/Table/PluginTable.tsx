import React from "react";
import i18n from '@dhis2/d2-i18n';
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "../../../../../../ui/table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../../../../../../ui/tooltip";
import {ArrowRightIcon, XIcon} from "lucide-react";
import {Button} from "../../../../../../ui/button";
import {AttributeForm} from "../Form";
import {Form} from "../../../../../../ui/form";
import {z} from "zod";
import useNestedForm from "../../../../../FormFieldPlugins/hooks/useNestedForm";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormAttribute} from "../../../../hooks/useMetadataFromType/Constants";
import { HelpTooltip } from "../../../../../../HelpTooltip";

type Props = {
    selectedAttributes: Record<string, string>,
    addAttribute: (IdFromApp: string, IdFromPlugin: string) => void,
    removeAttribute: (IdFromApp: string) => void,
    attributes: Record<string, z.infer<typeof FormAttribute>>,
}

export const PluginTable = ({ selectedAttributes, addAttribute, removeAttribute, attributes }: Props) => {
    const formSchema = z.object({
        IdFromApp: z.string().min(1, { message: i18n.t('Required') }),
        IdFromPlugin: z.string()
            .min(1, { message: i18n.t('Required') })
            .regex(/^[a-zA-Z]+$/, { message: i18n.t('Only letters allowed') })
            .refine((value) => {
                return !Object.values(selectedAttributes).includes(value);
            }, { message: i18n.t('Plugin ID already in use') })
    })

    const form = useNestedForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            IdFromApp: '',
            IdFromPlugin: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        addAttribute(values.IdFromApp, values.IdFromPlugin);
        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={'w-32'}>{i18n.t('Name')}</TableHead>
                            <TableHead className={'w-4'}></TableHead>
                            <TableHead className={'w-32'}>
                                <div className={'flex gap-1 items-center'}>
                                    {i18n.t('Plugin alias')}
                                    <HelpTooltip content={i18n.t('This is the generic ID that the plugin will use to refer to this attribute.')} />
                                </div>
                            </TableHead>
                            <TableHead className={'sr-only'}>
                                {i18n.t('Remove')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.keys(selectedAttributes).length > 0 ? Object.entries(selectedAttributes)
                            .map(([IdFromApp, IdFromPlugin]) => {
                                    return (
                                        <TableRow key={IdFromApp}>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger className={'text-left'}>
                                                            <p className={'truncate w-32'}>
                                                                {attributes[IdFromApp]?.displayName}
                                                            </p>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {attributes[IdFromApp]?.displayName}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>
                                                <ArrowRightIcon className={'h-4 w-4'} />
                                            </TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger className={'text-left'}>
                                                            <p className={'truncate w-32'}>
                                                                {IdFromPlugin}
                                                            </p>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {IdFromPlugin}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={() => removeAttribute(IdFromApp)}
                                                    variant={'ghost'}
                                                >
                                                    <XIcon className={'h-4 w-4'} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            ) : (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    {i18n.t('No configured attributes')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter className={'items-start'}>
                        <AttributeForm
                            attributes={attributes}
                            selectedAttributes={selectedAttributes}
                            control={form.control}
                        />
                    </TableFooter>
                </Table>
            </form>
        </Form>
    )
}
