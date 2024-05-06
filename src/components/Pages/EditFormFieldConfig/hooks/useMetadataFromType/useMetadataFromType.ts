import {useDataEngine} from "@dhis2/app-runtime";
import {FetchFunctionsByType} from "./Constants/constants";
import {useQuery} from "@tanstack/react-query";

type Props = {
    resourceId: string,
    metadataType: 'program' | 'trackedEntityType',
}

export const useMetadataFromType = ({ resourceId, metadataType }: Props) => {
    const dataEngine = useDataEngine();
    const fetchFunction = FetchFunctionsByType[metadataType];

    const { data, isLoading, isError } = useQuery({
        queryKey: [metadataType, resourceId],
        queryFn: () => fetchFunction({ resourceId, dataEngine }),
        staleTime: Infinity,
        cacheTime: Infinity,
    })

    return {
        metadata: data,
        isLoading,
        isError,
    }
}
