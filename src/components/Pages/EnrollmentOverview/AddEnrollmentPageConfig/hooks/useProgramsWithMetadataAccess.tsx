import {useQuery} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";
import {z} from "zod";

const trackerProgramSchema = z.object({
    id: z.string({ required_error: 'Program id is required' }),
    displayName: z.string({ required_error: 'Program display name is required' }),
    trackedEntityType: z.object({
        id: z.string({ required_error: 'Tracked entity type id is required' }),
        displayName: z.string({ required_error: 'Tracked entity type display name is required' }),
    }),
    programType: z.string({ required_error: 'Program type is required' }),
    access: z.object({
        write: z.boolean({ required_error: 'Write access is required' }),
    }),
});

export const useProgramsWithMetadataAccess = () => {
    const dataEngine = useDataEngine();
    const fields = 'id,displayName,access,trackedEntityType[id,displayName],programType';

    const getPrograms = async () => {
        const { programsQuery }: any = await dataEngine.query({
            programsQuery: {
                resource: 'programs',
                params: {
                    fields,
                    filter: 'programType:eq:WITH_REGISTRATION',
                    pageSize: 1000,
                }
            }
        });

        return trackerProgramSchema.array().parse(programsQuery.programs);
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ['programs', 'metadata-write'],
        queryFn: getPrograms,
        staleTime: Infinity,
        cacheTime: Infinity,
        useErrorBoundary: false,
    })

    return {
        programs: data,
        isLoading,
        isError,
    }
}
