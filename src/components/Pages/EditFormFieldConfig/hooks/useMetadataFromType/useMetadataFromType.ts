import {useDataEngine} from "@dhis2/app-runtime";
import {FetchFunctionsByType} from "./Constants/constants";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";
import {useProgramsWithMetadataAccess} from "../../../../../lib/hooks/useProgramsWithMetadataAccess";

type Props = {
    resourceId: string,
    metadataType: 'program' | 'trackedEntityType',
    programStageId?: string | null,
}

export const useMetadataFromType = ({ resourceId, metadataType, programStageId = null }: Props) => {
    const dataEngine = useDataEngine();
    const fetchFunction = FetchFunctionsByType[metadataType];
    const { programs } = useProgramsWithMetadataAccess();
    
    // Check if this is an event program and get its stage ID
    const eventProgramStageId = (() => {
        if (programs && metadataType === 'program') {
            const program = programs.find(p => p.id === resourceId);
            if (program && program.programType === 'WITHOUT_REGISTRATION' && program.programStages?.length) {
                return program.programStages[0].id;
            }
        }
        return null;
    })();
    
    // Use either the provided program stage ID or the one from the event program
    const effectiveProgramStageId = programStageId || eventProgramStageId;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [metadataType, resourceId, effectiveProgramStageId],
        queryFn: () => fetchFunction({ resourceId, dataEngine, programStageId: effectiveProgramStageId }),
        staleTime: Infinity,
        cacheTime: Infinity,
    })

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    return {
        metadata: data,
        isLoading,
        isError,
    }
}
