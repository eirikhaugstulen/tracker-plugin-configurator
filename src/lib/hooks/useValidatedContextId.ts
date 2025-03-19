import {useProgramsWithMetadataAccess} from "./useProgramsWithMetadataAccess";
import {useTrackedEntityTypes} from "./useTrackedEntityTypes";
import {useMemo} from "react";
import { MetadataType, MetadataTypes } from "../../components/Pages/FormFieldPlugins/hooks/useFormFieldConfig";

type Props = {
    contextId: string | undefined,
}

type Return = {
    validatedContextId: string | null,
    metadataType: MetadataType | null,
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
        metadataType: MetadataType | null,
    } = useMemo(() => {
        if (!contextId) {
            return {
                validatedContextId: null,
                metadataType: null,
                validatedProgramStageId: null,
            }
        }

        const program = programs
            ?.find(program => program.id === contextId);

        if (program) {
            // Determine if this is a tracker program or event program
            const isTrackerProgram = program.programType === 'WITH_REGISTRATION';
            
            return {
                validatedContextId: program.id,
                metadataType: isTrackerProgram ? MetadataTypes.trackerProgram : MetadataTypes.eventProgram,
            }
        }

        const trackedEntityType = trackedEntityTypes
            ?.find(trackedEntityType => trackedEntityType.id === contextId);

        if (trackedEntityType) {
            return {
                validatedContextId: trackedEntityType.id,
                metadataType: MetadataTypes.trackedEntityType,
            }
        }

        // Check if contextId is a program stage
        const programStage = programs
            ?.filter(program => program.programType === 'WITH_REGISTRATION')
            ?.flatMap(program => program.programStages || [])
            ?.find(programStage => programStage.id === contextId);

        if (programStage) {
            return {
                validatedContextId: programStage.id,
                metadataType: MetadataTypes.programStage,
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
