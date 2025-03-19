import {useDataEngine} from "@dhis2/app-runtime";
import {useQuery} from "@tanstack/react-query";
import {z} from "zod";
import {useEffect, useMemo} from "react";

const ProgramMetadataSchema = z.object({
    id: z.string({ required_error: 'Program id is missing in the API Payload. Please report the issue to the app maintainer.' }),
    displayName: z.string({ required_error: 'Program display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
    access: z.object({
        read: z.boolean({ required_error: 'Read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        write: z.boolean({ required_error: 'Write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        data: z.object({
            read: z.boolean({ required_error: 'Data read access is missing in the API Payload. Please report the issue to the app maintainer.' }),
            write: z.boolean({ required_error: 'Data write access is missing in the API Payload. Please report the issue to the app maintainer.' }),
        }),
    }),
    trackedEntityType: z.object({
        id: z.string({ required_error: 'Tracked entity type id is missing in the API Payload. Please report the issue to the app maintainer.' }),
        displayName: z.string({ required_error: 'Tracked entity type display name is missing in the API Payload. Please report the issue to the app maintainer.' }),
    }).optional(),
    programType: z.string({ required_error: 'Program type is missing in the API Payload. Please report the issue to the app maintainer.' }),
    programStages: z.array(z.object({
        id: z.string(),
        displayName: z.string(),
        sortOrder: z.number().optional(),
        program: z.object({
            id: z.string(),
        }),
    })).optional(),
});

const TrackedEntityTypeMetadataSchema = z.object({
    id: z.string({ required_error: 'Tracked entity type id is missing in the API Payload.' }),
    displayName: z.string({ required_error: 'Tracked entity type display name is missing in the API Payload.' }),
});

export const useFormFieldMetadata = () => {
    const dataEngine = useDataEngine();

    const getPrograms = async () => {
        const { programsQuery }: any = await dataEngine.query({
            programsQuery: {
                resource: 'programs',
                params: {
                    fields: 'id,displayName,access[read,write,data[read,write]],trackedEntityType[id,displayName],programType,programStages[id,displayName,sortOrder,program[id]]',
                    pageSize: 1000,
                }
            },
        });

        return ProgramMetadataSchema.array().parse(programsQuery.programs);
    }

    const getTrackedEntityTypes = async () => {
        const { trackedEntityTypesQuery }: any = await dataEngine.query({
            trackedEntityTypesQuery: {
                resource: 'trackedEntityTypes',
                params: {
                    fields: 'id,displayName',
                    pageSize: 1000,
                }
            },
        });

        return TrackedEntityTypeMetadataSchema.array().parse(trackedEntityTypesQuery.trackedEntityTypes);
    }

    const { data: programs, error: programsError, isLoading: isLoadingPrograms } = useQuery({
        queryKey: ['formFieldMetadata', 'programs'],
        queryFn: getPrograms,
        cacheTime: Infinity,
        staleTime: Infinity,
    });

    const programStages = useMemo(() => {
        if (!programs) return [];
        
        return programs
            .filter((program: any) => program.programType === 'WITH_REGISTRATION')
            .flatMap((program: any) => program.programStages);
    }, [programs]);

    const { data: trackedEntityTypes, error: tetError, isLoading: isLoadingTet } = useQuery({
        queryKey: ['formFieldMetadata', 'trackedEntityTypes'],
        queryFn: getTrackedEntityTypes,
        cacheTime: Infinity,
        staleTime: Infinity,
    });

    useEffect(() => {
        const errors = [programsError, tetError].filter(Boolean);
        if (errors.length > 0) {
            errors.forEach(error => console.error(error));
        }
    }, [programsError, tetError]);

    return {
        programs,
        programStages,
        trackedEntityTypes,
        isLoading: isLoadingPrograms || isLoadingTet,
    }
}
