import {useDataEngine} from "@dhis2/app-runtime";
import {z} from "zod";
import {useQuery} from "@tanstack/react-query";

export const TrackedEntityTypeSchema = z.object({
    id: z.string({ required_error: 'Tracked entity type id is missing in the API Payload. Please report the issue to the app maintainer.' }),
    displayName: z.string({ required_error: 'Tracked entity type display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
    access: z.object({
        read: z.boolean({ required_error: 'Read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        write: z.boolean({ required_error: 'Write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        data: z.object({
            read: z.boolean({ required_error: 'Data read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
            write: z.boolean({ required_error: 'Data write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        }),
    }),
});

export const useTrackedEntityTypes = () => {
    const dataEngine = useDataEngine();

    const getTrackedEntityTypes = async () => {
        const fields = 'id,displayName,access[read,write,data[read,write]]';
        const { trackedEntityTypes }: any = await dataEngine.query({
            trackedEntityTypes: {
                resource: 'trackedEntityTypes',
                params: {
                    fields,
                    pageSize: 1000,
                }
            }
        });

        return TrackedEntityTypeSchema.array().parse(trackedEntityTypes.trackedEntityTypes);
    }

    const { isLoading, data: trackedEntityTypes, isError } = useQuery({
        queryKey: ['trackedEntityTypes', 'metadata-write'],
        queryFn: getTrackedEntityTypes,
        cacheTime: Infinity,
        staleTime: Infinity,
    })

    return {
        trackedEntityTypes,
        isLoading,
        isError,
    }
}
