import {Button} from "../../../../../../ui/button";
import {TableCell, TableRow} from "../../../../../../ui/table";
import i18n from '@dhis2/d2-i18n';
import React from "react";
import {z} from "zod";
import type { FormField as FormFieldMetadata } from "../../../../hooks/useMetadataFromType/Constants";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../../../../ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../../../../ui/select";
import {Input} from "../../../../../../ui/input";
import {Control} from "react-hook-form";

type Props = {
    attributes: Record<string, z.infer<typeof FormFieldMetadata>>,
    selectedAttributes: Record<string, string>,
    control: Control<{IdFromApp: string, IdFromPlugin: string}>
}

export const AttributeForm = ({ attributes, selectedAttributes, control }: Props) => {
    return (
        <TableRow>
            <TableCell className={'align-top'} colSpan={2}>
                <FormField
                    control={control}
                    name="IdFromApp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={'sr-only'}>{i18n.t('Select attribute')}</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger
                                        className={'w-40'}
                                    >
                                        <SelectValue placeholder={i18n.t('Field')} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.entries(attributes).map(([id, attribute]) => {
                                        if (!selectedAttributes[id]) {
                                            return (
                                                <SelectItem value={id.toString()} key={id}>
                                                    {attribute.displayName}
                                                </SelectItem>
                                            )
                                        }
                                    })}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </TableCell>
            <TableCell className={'align-top'}>
                <FormField
                    control={control}
                    name="IdFromPlugin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={'sr-only'}>{i18n.t('Plugin attribute')}</FormLabel>
                            <FormControl>
                                <Input {...field} className={'w-32'} placeholder="Plugin Alias" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </TableCell>
            <TableCell className={'align-top'}>
                <Button
                    className={'mt-2'}
                    type="submit"
                >
                    {i18n.t('Add')}
                </Button>
            </TableCell>
        </TableRow>
    )
}
