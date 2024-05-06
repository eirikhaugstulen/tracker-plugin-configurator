import {useQuery} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";
import {useFormFieldMetadata} from "./useFormFieldMetadata";
import {ContextFormSchema} from "../../EditFormFieldConfig/FormController/hooks/useValidateAndSave";

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
    const { programs, isLoading: isLoadingMetadata } = useFormFieldMetadata();

    const getFormFieldConfig = async () => {
        const { formFieldConfigQuery } = await dataEngine.query({
            formFieldConfigQuery: {
                resource: 'dataStore/capture/dataEntryForms',
            }
        });

        return formFieldConfigQuery;
    }

    const { isLoading, isError, data } = useQuery({
        queryKey: ['formFieldConfig'],
        queryFn: getFormFieldConfig,
        select: (dataEntryForm) => {
            if (!dataEntryForm) return [];
            return Object
                .entries(dataEntryForm)
                .map(([id, record]) => {
                    const programMetadata = programs?.find((program) => program.id === id);
                    if (!programMetadata) return null;
                    if (programMetadata.programType !== 'WITH_REGISTRATION') return null;

                    const { success } = ContextFormSchema.safeParse(record);

                    return ({
                        id,
                        program: {
                            id: programMetadata.id,
                            displayName: programMetadata.displayName,
                        },
                        trackedEntityType: programMetadata.trackedEntityType,
                        sections: record,
                        valid: success,
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

