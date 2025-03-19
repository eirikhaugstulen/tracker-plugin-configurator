import { useQuery } from "@tanstack/react-query";
import { useDataEngine } from "@dhis2/app-runtime";
import { z } from "zod";
import { useEffect } from "react";

export const trackerProgramSchema = z.object({
    id: z.string({ required_error: 'Program id is required' }),
    displayName: z.string({ required_error: 'Program display name is required' }),
    trackedEntityType: z.object({
        id: z.string({ required_error: 'Tracked entity type id is required' }),
        displayName: z.string({ required_error: 'Tracked entity type display name is required' }),
    }).optional(),
    programType: z.string({ required_error: 'Program type is required' }),
    access: z.object({
        write: z.boolean({ required_error: 'Write access is required' }),
    }),
    programStages: z.array(z.object({
        id: z.string({ required_error: 'Program stage id is required' }),
        displayName: z.string({ required_error: 'Program stage display name is required' }),
    })),
});

export const useProgramsWithMetadataAccess = () => {
    const dataEngine = useDataEngine();
    const fields = 'id,displayName,access,trackedEntityType[id,displayName],programType,programStages[id,displayName,programStageSections[id,displayName,sortOrder,dataElements[id]]]';

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

        return trackerProgramSchema.array().parse(programsQuery.programs);
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['programs'],
        queryFn: getPrograms,
        staleTime: Infinity,
        cacheTime: Infinity,
    })

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    return {
        programs: data,
        isLoading,
        isError,
    }
}
