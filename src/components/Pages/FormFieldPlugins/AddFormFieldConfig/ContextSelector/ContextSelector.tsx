import React from "react";
import i18n from '@dhis2/d2-i18n';
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../../ui/select";
import { useProgramsWithMetadataAccess } from "../../../../../lib/hooks/useProgramsWithMetadataAccess";
import { Skeleton } from "../../../../ui/skeleton";
import { ProgramStageSelector } from "./ProgramStageSelector";
import { useTrackedEntityTypes } from "../../../../../lib/hooks/useTrackedEntityTypes";

export const ContextSelector = () => {
    const { control } = useFormContext();
    const { trackedEntityTypes, isLoading: isLoadingTETs, isError: isErrorTETs } = useTrackedEntityTypes();
    const { programs, isLoading: isLoadingPrograms, isError: isErrorPrograms } = useProgramsWithMetadataAccess();

    const isLoading = isLoadingTETs || isLoadingPrograms;
    const isError = isErrorTETs || isErrorPrograms;

    if (isLoading) {
        return <Skeleton className={'h-7'} />;
    }

    if (isError || !trackedEntityTypes || !programs) {
        return <p className={'text-neutral-700 text-sm'}>{i18n.t('An error occurred while loading metadata')}</p>;
    }

    const trackerPrograms = programs.filter(program => program.programType === 'WITH_REGISTRATION');
    const eventPrograms = programs.filter(program => program.programType === 'WITHOUT_REGISTRATION');

    if (trackedEntityTypes.length === 0 && programs.length === 0) {
        return <p className={'text-neutral-700 text-sm'}>{i18n.t('There seems like you don\'t have metadata access to any tracked entity types or programs')}</p>;
    }

    return (
        <>
            <FormField
                control={control}
                name="contextId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{i18n.t('Configuration Context')} *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={i18n.t('Please select a configuration context')} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {trackedEntityTypes.length > 0 && (
                                    <SelectGroup>
                                        <SelectLabel className="px-2 font-semibold">{i18n.t('Tracked Entity Types')}</SelectLabel>
                                        {trackedEntityTypes.map(tet => (
                                            <SelectItem
                                                key={`tet-${tet.id}`}
                                                value={`tet-${tet.id}`}
                                                className="pl-6"
                                            >
                                                {tet.displayName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                )}

                                {trackerPrograms.length > 0 && (
                                    <SelectGroup>
                                        <SelectLabel className="px-2 font-semibold">{i18n.t('Tracker Programs')}</SelectLabel>
                                        {trackerPrograms.map(program => (
                                            <SelectItem
                                                key={`program-${program.id}`}
                                                value={`program-${program.id}`}
                                                className="pl-6"
                                            >
                                                {program.displayName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                )}

                                {eventPrograms.length > 0 && (
                                    <SelectGroup>
                                        <SelectLabel className="px-2 font-semibold">{i18n.t('Event Programs')}</SelectLabel>
                                        {eventPrograms.map(program => (
                                            <SelectItem
                                                key={`program-${program.id}`}
                                                value={`program-${program.id}`}
                                                className="pl-6"
                                            >
                                                {program.displayName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <ProgramStageSelector />
        </>
    );
}; 