import {useQuery} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";
import {z} from "zod";
import {useEffect} from "react";

export const trackerProgramSchema = z.object({
    id: z.string({ required_error: 'Program id is required' }),
    displayName: z.string({ required_error: 'Program display name is required' }),
    trackedEntityType: z.object({
        id: z.string({ required_error: 'Tracked entity type id is required' }),
        displayName: z.string({ required_error: 'Tracked entity type display name is required' }),
    }),
    programType: z.literal('WITH_REGISTRATION'),
    access: z.object({
        write: z.boolean({ required_error: 'Write access is required' }),
    }),
});

const eventProgramSchema = z.object({
    id: z.string({ required_error: 'Program id is required' }),
    displayName: z.string({ required_error: 'Program display name is required' }),
    programType: z.literal('WITHOUT_REGISTRATION'),
    access: z.object({
        write: z.boolean({ required_error: 'Write access is required' }),
    }),
});

const programSchema = z.union([trackerProgramSchema, eventProgramSchema]);

type Props = {
    programType?: 'WITH_REGISTRATION' | 'WITHOUT_REGISTRATION' | undefined,
}

export const useProgramsWithMetadataAccess = ({ programType }: Props = {}) => {
    const dataEngine = useDataEngine();
    const fields = 'id,displayName,access,trackedEntityType[id,displayName],programType';

    const getPrograms = async () => {
        const { programsQuery }: any = await dataEngine.query({
            programsQuery: {
                resource: 'programs',
                params: {
                    fields,
                    pageSize: 1000,
                }
            }
        });

        return programSchema.array().parse(programsQuery.programs);
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['programs', programType],
        queryFn: getPrograms,
        staleTime: Infinity,
        cacheTime: Infinity,
        select: (data: Array<z.infer<typeof programSchema>>) => {
            if (!programType) {
                return data;
            }

            return data.filter((program) => program.programType === programType);
        }
    })

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    return {
        programs: data as Array<z.infer<typeof programSchema>> | undefined,
        isLoading,
        isError,
    }
}
