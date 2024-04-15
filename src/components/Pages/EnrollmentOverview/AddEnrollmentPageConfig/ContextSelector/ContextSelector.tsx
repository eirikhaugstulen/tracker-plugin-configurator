import i18n from '@dhis2/d2-i18n';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../../ui/select";
import React from "react";
import {useProgramsWithMetadataAccess} from "../hooks";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../../ui/form";

type Props = {
    form: any
}

export const ContextSelector = ({ form }: Props) => {
    const {
        programs,
        isLoading,
        isError,
    } = useProgramsWithMetadataAccess();

    if (isLoading) {
        return <p>{i18n.t('Loading programs...')}</p>
    }

    if (isError) {
        return <p>{i18n.t('An error occurred while loading programs')}</p>
    }

    if (programs.length === 0) {
        return <p>{i18n.t('There seems like you don\'t have metadata access to any programs')}</p>
    }

    return (
        <div className="flex flex-col gap-4">
            <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{i18n.t('Program')} *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={i18n.t('Please select a program')} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {programs.map(apiProgram => (
                                    <SelectItem
                                        key={apiProgram.id}
                                        value={apiProgram.id}
                                    >
                                        {apiProgram.displayName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="page"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{i18n.t('Page')} *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={i18n.t('Please select a page')} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="enrollmentOverviewLayout">
                                    {i18n.t('Overview')}
                                </SelectItem>
                                <SelectItem value="enrollmentEventNewLayout">
                                    {i18n.t('New event')}
                                </SelectItem>
                                <SelectItem value="enrollmentEventEditLayout">
                                    {i18n.t('Edit event')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
