import { useDataEngine } from "@dhis2/app-runtime";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const programStageSchema = z.object({
    id: z.string({ required_error: 'Program stage id is required' }),
    displayName: z.string({ required_error: 'Program stage display name is required' }),
});

type Props = {
    programId: string | undefined;
};

export const useProgramStages = ({ programId }: Props) => {
    const dataEngine = useDataEngine();

    const getProgramStages = async () => {
        if (!programId) return [];

        const { programStages }: any = await dataEngine.query({
            programStages: {
                resource: 'programs',
                id: programId,
                params: {
                    fields: 'programStages[id,displayName]',
                }
            }
        });

        if (!programStages.programStages || !programStages.programStages.length) {
            return [];
        }

        return programStageSchema.array().parse(programStages.programStages);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['program-stages', programId],
        queryFn: getProgramStages,
        enabled: !!programId,
        staleTime: Infinity,
        cacheTime: Infinity,
    });

    return {
        programStages: data || [],
        isLoading,
        isError,
    };
}; 