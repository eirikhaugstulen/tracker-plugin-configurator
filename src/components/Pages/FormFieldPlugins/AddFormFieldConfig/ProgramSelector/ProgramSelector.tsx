import React, {useEffect, useRef} from "react";
import i18n from '@dhis2/d2-i18n';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../../ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../../ui/select";
import {useProgramsByTETId} from "./hooks/useProgramsByTETId";
import {useFormContext, useWatch} from "react-hook-form";

export const ProgramSelector = () => {
    const currentTrackedEntityTypeId = useRef<string | undefined>(undefined)
    const { control, resetField } = useFormContext();
    const trackedEntityType = useWatch({
        control,
        name: 'trackedEntityType',
    })

    const {
        programs,
    } = useProgramsByTETId({ trackedEntityTypeId: trackedEntityType });

    useEffect(() => {
        if (trackedEntityType !== currentTrackedEntityTypeId.current) {
            currentTrackedEntityTypeId.current = trackedEntityType;
            resetField('program');
        }
    }, [trackedEntityType]);

    return (
        <FormField
            control={control}
            name="program"
            render={({ field }) => (
                <FormItem className={'mt-4'}>
                    <FormLabel>{i18n.t('Program (optional)')}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!trackedEntityType || !programs?.length}
                    >
                        <FormControl>
                            <>
                                <SelectTrigger>
                                    <SelectValue placeholder={
                                        !trackedEntityType
                                            ? i18n.t('Select a type')
                                            : programs?.length === 0
                                            ? i18n.t('No programs available for this type')
                                            : i18n.t('Select a program')
                                    } />
                                </SelectTrigger>
                            </>
                        </FormControl>
                        <SelectContent>
                            {trackedEntityType && programs?.map(program => (
                                <SelectItem
                                    key={program.id}
                                    value={program.id}
                                >
                                    {program.displayName}
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
