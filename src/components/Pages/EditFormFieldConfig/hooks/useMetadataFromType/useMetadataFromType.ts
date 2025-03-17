import {useDataEngine} from "@dhis2/app-runtime";
import {FetchFunctionsByType} from "./Constants/constants";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";

type Props = {
    resourceId: string,
    metadataType: 'program' | 'trackedEntityType',
    programStageId?: string | null,
}

export const useMetadataFromType = ({ resourceId, metadataType, programStageId = null }: Props) => {
    const dataEngine = useDataEngine();
    const fetchFunction = FetchFunctionsByType[metadataType];

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [metadataType, resourceId, programStageId],
        queryFn: () => fetchFunction({ resourceId, dataEngine, programStageId }),
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
