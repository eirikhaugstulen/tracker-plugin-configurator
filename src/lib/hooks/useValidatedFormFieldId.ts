import {useProgramsWithMetadataAccess} from "./useProgramsWithMetadataAccess";
import {useTrackedEntityTypes} from "./useTrackedEntityTypes";
import {useMemo} from "react";

type Props = {
    formFieldId: string | undefined,
}

type Return = {
    validatedFormFieldId: string | null,
    metadataType: 'program' | 'trackedEntityType' | null,
    isLoading: boolean,
    isError: boolean,
}

export const useValidatedFormFieldId = ({ formFieldId }: Props): Return => {
    const {
        programs,
        isLoading: isLoadingPrograms,
        isError: isErrorPrograms,
    } = useProgramsWithMetadataAccess();
    const {
        trackedEntityTypes,
        isLoading: isLoadingTETs,
        isError: isErrorTETs,
    } = useTrackedEntityTypes();

    const {
        validatedFormFieldId,
        metadataType,
    }: {
        validatedFormFieldId: string | null,
        metadataType: 'program' | 'trackedEntityType' | null,
    } = useMemo(() => {
        if (!formFieldId) {
            return {
                validatedFormFieldId: null,
                metadataType: null,
            }
        }

        const program = programs
            ?.find(program => program.id === formFieldId);

        if (program) {
            return {
                validatedFormFieldId: program.id,
                metadataType: 'program',
            }
        }

        const trackedEntityType = trackedEntityTypes
            ?.find(trackedEntityType => trackedEntityType.id === formFieldId);

        if (trackedEntityType) {
            return {
                validatedFormFieldId: trackedEntityType.id,
                metadataType: 'trackedEntityType',
            }
        }

        return {
            validatedFormFieldId: null,
            metadataType: null,
        }
    }, [formFieldId, programs, trackedEntityTypes])

    return {
        validatedFormFieldId,
        metadataType,
        isLoading: isLoadingPrograms || isLoadingTETs,
        isError: isErrorPrograms || isErrorTETs,
    }
}
