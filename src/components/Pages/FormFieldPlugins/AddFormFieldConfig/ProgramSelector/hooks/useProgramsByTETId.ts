import {useProgramsWithMetadataAccess} from "../../../../../../lib/hooks/useProgramsWithMetadataAccess";
import {useMemo} from "react";

type Props = {
    trackedEntityTypeId: string | undefined,
}
export const useProgramsByTETId = ({ trackedEntityTypeId }: Props) => {
    const { programs, isLoading, isError } = useProgramsWithMetadataAccess();

    const availablePrograms = useMemo(() => {
        if (!trackedEntityTypeId || !programs?.length) {
            return null;
        }

        return programs
            .filter(program => program.programType === 'WITH_REGISTRATION')
            .filter(program => program.trackedEntityType?.id === trackedEntityTypeId)
    }, [programs, trackedEntityTypeId])

    return {
        programs: availablePrograms,
        isLoading,
        isError,
    }
}
