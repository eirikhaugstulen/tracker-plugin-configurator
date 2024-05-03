import {useQuery} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";
import {useFormFieldMetadata} from "./useFormFieldMetadata";

export type FormFieldRecord = {
    id: string,
    program: {
        id: string,
        displayName: string,
    },
    trackedEntityType: {
        id: string,
        displayName: string,
    },
    sections: {
        id: string,
        name: string,
        elements: {
            id: string,
            type: string,
        }
    }[],
    valid: boolean,
}

export const useFormFieldConfig = () => {
    const dataEngine = useDataEngine();
    const { programs, isLoading: isLoadingMetadata } = useFormFieldMetadata();

    const { isLoading, isError, data } = useQuery({
        queryKey: ['formFieldConfig'],
        queryFn: () => dataEngine.query({
            formFieldConfigQuery: {
                resource: 'dataStore/capture/dataEntryForms',
                params: {
                    fields: '*'
                }
            }
        }),
        select: ({ formFieldConfigQuery }) => {
            if (!formFieldConfigQuery) return [];
            return Object
                .entries(formFieldConfigQuery)
                .map(([id, record]) => {
                    const programMetadata = programs?.find((program) => program.id === id);
                    if (!programMetadata) return null;
                    if (programMetadata.programType !== 'WITH_REGISTRATION') return null;

                    return ({
                        id,
                        program: {
                            id: programMetadata.id,
                            displayName: programMetadata.displayName,
                        },
                        trackedEntityType: programMetadata.trackedEntityType,
                        sections: record,
                        valid: true,
                    });
                }).filter(Boolean) as FormFieldRecord[];
        },
        enabled: !isLoadingMetadata,
    })

    return {
        records: data,
        isLoading,
        isError,
    }
}

