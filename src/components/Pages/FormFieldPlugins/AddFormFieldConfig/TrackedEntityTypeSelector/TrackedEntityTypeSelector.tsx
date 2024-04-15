import React from "react";
import i18n from '@dhis2/d2-i18n';
import {useFormContext} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../../ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../../ui/select";
import {useTrackedEntityTypes} from "../../hooks/useTrackedEntityTypes";
import {Skeleton} from "../../../../ui/skeleton";

export const TrackedEntityTypeSelector = () => {
    const { control } = useFormContext();
    const { trackedEntityTypes, isLoading, isError} = useTrackedEntityTypes();

    if (isLoading) {
        return (
            <Skeleton className={'h-7'} />
        )
    }

    if (isError) {
        return <p className={'text-neutral-700 text-sm'}>{i18n.t('An error occurred while loading tracked entity types')}</p>
    }

    if (trackedEntityTypes.length === 0) {
        return <p className={'text-neutral-700 text-sm'}>{i18n.t('There seems like you don\'t have metadata access to any tracked entity types')}</p>
    }

    return (
        <FormField
            control={control}
            name="trackedEntityType"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{i18n.t('Tracked Entity Type')} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={i18n.t('Please select a tracked entity type')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {trackedEntityTypes.map(trackedEntityType => (
                                <SelectItem
                                    key={trackedEntityType.id}
                                    value={trackedEntityType.id}
                                >
                                    {trackedEntityType.displayName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
