import {useProgramsWithMetadataAccess} from "./useProgramsWithMetadataAccess";
import {useTrackedEntityTypes} from "./useTrackedEntityTypes";
import {useMemo} from "react";

type Props = {
    contextId: string | undefined,
}

type Return = {
    validatedContextId: string | null,
    metadataType: 'program' | 'trackedEntityType' | null,
    isLoading: boolean,
    isError: boolean,
}

export const useValidatedContextId = ({ contextId }: Props): Return => {
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
        validatedContextId,
        metadataType,
    }: {
        validatedContextId: string | null,
        metadataType: 'program' | 'trackedEntityType' | null,
    } = useMemo(() => {
        if (!contextId) {
            return {
                validatedContextId: null,
                metadataType: null,
            }
        }

        const program = programs
            ?.find(program => program.id === contextId);

        if (program) {
            return {
                validatedContextId: program.id,
                metadataType: 'program',
            }
        }

        const trackedEntityType = trackedEntityTypes
            ?.find(trackedEntityType => trackedEntityType.id === contextId);

        if (trackedEntityType) {
            return {
                validatedContextId: trackedEntityType.id,
                metadataType: 'trackedEntityType',
            }
        }

        return {
            validatedContextId: null,
            metadataType: null,
        }
    }, [contextId, programs, trackedEntityTypes])

    return {
        validatedContextId,
        metadataType,
        isLoading: isLoadingPrograms || isLoadingTETs,
        isError: isErrorPrograms || isErrorTETs,
    }
}
