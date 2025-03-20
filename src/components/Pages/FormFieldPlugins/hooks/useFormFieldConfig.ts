import {useQuery} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";
import {useFormFieldMetadata} from "./useFormFieldMetadata";
import {ContextFormSchema} from "../../FormFieldConfigurator/FormController/hooks/useValidateAndSave";
import {useEffect, useMemo} from "react";

export type MetadataType = (typeof MetadataTypes)[keyof typeof MetadataTypes];

export const MetadataTypes = Object.freeze({
    trackerProgram: 'trackerProgram',
    eventProgram: 'eventProgram',
    trackedEntityType: 'trackedEntityType',
    programStage: 'programStage',
} as const);

export type FormFieldRecord = {
    id: string,
    name: string,
    metadataType: MetadataType,
    metadataId: string,
    parentId?: string,
    parentName?: string,
    parentHasConfiguration?: boolean,
    sortOrder?: number,
    sections: {
        id: string,
        name: string,
        elements: Array<{
            [x: string]: any;
            id: string,
            name: string,
            type: 'plugin' | 'TrackedEntityAttribute',
        }>
    }[],
    valid: boolean,
}

export const useFormFieldConfig = () => {
    const dataEngine = useDataEngine();

    const { 
        programs,
        programStages,
        trackedEntityTypes,
        isLoading: isLoadingMetadata
    } = useFormFieldMetadata();

    const getFormFieldConfig = async () => {
        const { formFieldConfigQuery } = await dataEngine.query({
            formFieldConfigQuery: {
                resource: 'dataStore/capture/dataEntryForms',
            }
        });
        return formFieldConfigQuery;
    }

    const { isLoading, isError, data: rawData, error } = useQuery({
        queryKey: ['formFieldConfig'],
        queryFn: getFormFieldConfig,
        enabled: !isLoadingMetadata,
        retry: false,
        cacheTime: Infinity,
        staleTime: Infinity,
    });

    const formattedRecords = useMemo(() => {
        if (!rawData) return [];
        
        return Object
            .entries(rawData)
            .map(([id, record]) => {
                // 1. First check if it's a program (most common case)
                const programMetadata = programs?.find((program) => program.id === id);
                if (programMetadata) {
                    const { success } = ContextFormSchema.safeParse(record);
                    
                    if (programMetadata.programType === 'WITH_REGISTRATION') {
                        return {
                            id,
                            name: programMetadata.displayName,
                            metadataType: MetadataTypes.trackerProgram,
                            metadataId: programMetadata.id,
                            sections: record,
                            valid: success,
                        };
                    } else {
                        return {
                            id,
                            name: programMetadata.displayName,
                            metadataType: MetadataTypes.eventProgram,
                            metadataId: programMetadata.id,
                            sections: record,
                            valid: success,
                        };
                    }
                }
                
                // 2. Then check if it's a tracked entity type
                const tetMetadata = trackedEntityTypes?.find((tet) => tet.id === id);
                if (tetMetadata) {
                    const { success } = ContextFormSchema.safeParse(record);
                    
                    return {
                        id,
                        name: tetMetadata.displayName,
                        metadataType: MetadataTypes.trackedEntityType,
                        metadataId: tetMetadata.id,
                        sections: record,
                        valid: success,
                    };
                }
                
                // 3. Finally check if it's a program stage (least common case)
                const programStageMetadata = programStages?.find((stage) => stage.id === id);

                if (programStageMetadata) {
                    const { success } = ContextFormSchema.safeParse(record);
                    const parentProgram = programs?.find(program => program.id === programStageMetadata.program.id);
                    const parentHasConfiguration = Object.keys(rawData).includes(programStageMetadata.program.id);
                    
                    return {
                        id,
                        name: programStageMetadata.displayName,
                        metadataType: MetadataTypes.programStage,
                        metadataId: programStageMetadata.id,
                        parentId: programStageMetadata.program.id,
                        parentName: parentProgram?.displayName,
                        parentHasConfiguration,
                        sortOrder: programStageMetadata.sortOrder,
                        sections: record,
                        valid: success,
                    };
                }
                
                return null;
            }).filter(Boolean) as FormFieldRecord[];
    }, [rawData, programs, programStages, trackedEntityTypes]);

    useEffect(() => {
        if (error) {
            console.error('Error in useFormFieldConfig:', error);
        }
    }, [error]);

    return {
        records: formattedRecords,
        rawData,
        isLoading,
        isError,
    }
}

