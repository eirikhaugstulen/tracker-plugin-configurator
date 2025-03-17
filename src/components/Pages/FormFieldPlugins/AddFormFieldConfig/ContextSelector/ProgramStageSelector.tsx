import React from "react";
import i18n from '@dhis2/d2-i18n';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../ui/select";
import { useFormContext, useWatch } from "react-hook-form";
import { useProgramStages } from "./hooks/useProgramStages";
import { Skeleton } from "../../../../ui/skeleton";
import { useProgramsWithMetadataAccess } from "../../../../../lib/hooks/useProgramsWithMetadataAccess";

export const ProgramStageSelector = () => {
    const { control, setValue } = useFormContext();
    const contextId = useWatch({
        control,
        name: 'contextId',
    });

    const { programs } = useProgramsWithMetadataAccess();

    // Only extract program ID if this is a program selection
    const programId = contextId?.startsWith('program-')
        ? contextId.substring(8) // Remove 'program-' prefix
        : undefined;

    // Check if the selected program is a tracker program
    const selectedProgram = programs?.find(p => p.id === programId);
    const isTrackerProgram = selectedProgram?.programType === 'WITH_REGISTRATION';

    const { programStages, isLoading } = useProgramStages({ programId });

    // If we change the program, clear any selected program stage
    React.useEffect(() => {
        if (contextId?.startsWith('program-')) {
            setValue('programStageId', '');
        }
    }, [contextId, setValue]);

    // Only show for tracker programs, not for event programs or other contexts
    if (!contextId?.startsWith('program-') || !isTrackerProgram) {
        return null;
    }

    if (isLoading) {
        return <Skeleton className={'h-7 mt-4'} />;
    }

    if (programStages.length === 0) {
        return (
            <p className={'text-neutral-700 text-sm mt-4'}>
                {i18n.t('No program stages available for this program')}
            </p>
        );
    }

    return (
        <FormField
            control={control}
            name="programStageId"
            render={({ field }) => (
                <FormItem className="mt-4">
                    <FormLabel>{i18n.t('Program Stage (optional)')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={i18n.t('Select to configure a specific program stage (optional)')}
                                />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {programStages.map(stage => (
                                <SelectItem
                                    key={stage.id}
                                    value={stage.id}
                                    className="pl-6"
                                >
                                    {stage.displayName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 