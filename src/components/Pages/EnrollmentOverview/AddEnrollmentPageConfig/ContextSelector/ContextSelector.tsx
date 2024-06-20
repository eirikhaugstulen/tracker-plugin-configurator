import i18n from '@dhis2/d2-i18n';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../../ui/select";
import React from "react";
import {useProgramsWithMetadataAccess} from "../../../../../lib/hooks/useProgramsWithMetadataAccess";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../../ui/form";

type Props = {
    form: any
}

export const ContextSelector = ({ form }: Props) => {
    const {
        programs,
        isLoading,
        isError,
    } = useProgramsWithMetadataAccess({ programType: 'WITH_REGISTRATION' });

    if (isLoading) {
        return <p>{i18n.t('Loading programs...')}</p>
    }

    if (isError) {
        return <p>{i18n.t('An error occurred while loading programs')}</p>
    }

    if (!programs || programs.length === 0) {
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
        </div>
    )
}
