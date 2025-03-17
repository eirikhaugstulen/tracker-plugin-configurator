import {useProgramsWithMetadataAccess} from "./useProgramsWithMetadataAccess";
import {useTrackedEntityTypes} from "./useTrackedEntityTypes";
import {useMemo} from "react";
import { useParams } from "react-router-dom";

type Props = {
    contextId: string | undefined,
}

type Return = {
    validatedContextId: string | null,
    programStageId: string | null,
    metadataType: 'trackerProgram' | 'eventProgram' | 'trackedEntityType' | 'programStage' | null,
    isLoading: boolean,
    isError: boolean,
}

export const useValidatedContextId = ({ contextId }: Props): Return => {
    // Check if we have a program stage in the URL
    const { programStageId } = useParams<{ programStageId?: string }>();
    
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
        validatedProgramStageId,
    }: {
        validatedContextId: string | null,
        metadataType: 'trackerProgram' | 'eventProgram' | 'trackedEntityType' | 'programStage' | null,
        validatedProgramStageId: string | null,
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
            
            // Only consider program stages for tracker programs
            if (programStageId && isTrackerProgram) {
                return {
                    validatedContextId: program.id,
                    metadataType: 'programStage',
                    validatedProgramStageId: programStageId,
                }
            }
            
            return {
                validatedContextId: program.id,
                metadataType: isTrackerProgram ? 'trackerProgram' : 'eventProgram',
                validatedProgramStageId: null,
            }
        }

        const trackedEntityType = trackedEntityTypes
            ?.find(trackedEntityType => trackedEntityType.id === contextId);

        if (trackedEntityType) {
            return {
                validatedContextId: trackedEntityType.id,
                metadataType: 'trackedEntityType',
                validatedProgramStageId: null,
            }
        }

        return {
            validatedContextId: null,
            metadataType: null,
            validatedProgramStageId: null,
        }
    }, [contextId, programs, trackedEntityTypes, programStageId])

    return {
        validatedContextId,
        programStageId: validatedProgramStageId,
        metadataType,
        isLoading: isLoadingPrograms || isLoadingTETs,
        isError: isErrorPrograms || isErrorTETs,
    }
}
