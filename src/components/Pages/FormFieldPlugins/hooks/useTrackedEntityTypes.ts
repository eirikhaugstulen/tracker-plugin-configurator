import {useDataEngine} from "@dhis2/app-runtime";
import {useQuery} from "@tanstack/react-query";
import {z} from "zod";

const trackedEntityTypeSchema = z.object({
    id: z.string({ required_error: 'Tracked entity type id is required' }),
    displayName: z.string({ required_error: 'Tracked entity type display name is required' }),
});

export const useTrackedEntityTypes = () => {
    const dataEngine = useDataEngine();
    const fields = 'id,displayName';

    const getTrackEntityTypes = async () => {
        const { trackedEntityTypes }: any = await dataEngine.query({
            trackedEntityTypes: {
                resource: 'trackedEntityTypes',
                params: {
                    fields,
                    filter: 'access.write:eq:true',
                    pageSize: 1000,
                }
            }
        });

        return trackedEntityTypeSchema.array().parse(trackedEntityTypes.trackedEntityTypes);
    }
    const { data, isLoading, isError } = useQuery({
        queryKey: ['trackedEntityTypes', { fields }],
        queryFn: getTrackEntityTypes,
        staleTime: Infinity,
        cacheTime: Infinity,
    })

    return {
        trackedEntityTypes: data,
        isLoading,
        isError,
    }
}
