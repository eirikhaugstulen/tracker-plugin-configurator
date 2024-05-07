import {useDataEngine} from "@dhis2/app-runtime";
import {FetchFunctionsByType} from "./Constants/constants";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";

type Props = {
    resourceId: string,
    metadataType: 'program' | 'trackedEntityType',
}

export const useMetadataFromType = ({ resourceId, metadataType }: Props) => {
    const dataEngine = useDataEngine();
    const fetchFunction = FetchFunctionsByType[metadataType];

    const { data, isLoading, isError, error } = useQuery({
        queryKey: [metadataType, resourceId],
        queryFn: () => fetchFunction({ resourceId, dataEngine }),
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
