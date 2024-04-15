import React from "react";
import i18n from '@dhis2/d2-i18n';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../../ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../../ui/select";
import {useFormContext} from "react-hook-form";

export const ProgramStageSelector = () => {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name="programStage"
            render={({ field }) => (
                <FormItem className={'mt-4'}>
                    <FormLabel>{i18n.t('Program stage')}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={true}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={i18n.t('Coming soon!')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem
                                value="programStageId"
                            >
                                {i18n.t('Program Stage')}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
