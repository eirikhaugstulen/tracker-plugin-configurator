import {useDataEngine} from "@dhis2/app-runtime";
import {useQuery} from "@tanstack/react-query";

type ProgramMetadata = {
    id: string,
    displayName: string,
    trackedEntityType?: {
        id: string,
        displayName: string,
    },
    programType: string,
}

export const useFormFieldMetadata = () => {
    const dataEngine = useDataEngine();
    const { isLoading, data } = useQuery({
        queryKey: ['formFieldMetadata'],
        queryFn: () => dataEngine.query({
            programsQuery: {
                resource: 'programs',
                params: {
                    fields: 'id,displayName,trackedEntityType[id,displayName],programType',
                    pageSize: 1000,
                }
            },
        }),
        cacheTime: Infinity,
        staleTime: Infinity,
        select: ({ programsQuery }: any) => programsQuery.programs as ProgramMetadata[],
    })

    return {
        programs: data,
        isLoading,
    }
}
