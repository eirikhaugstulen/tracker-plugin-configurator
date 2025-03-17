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
        displayName: z.string()
    })).optional(),
});

const ProgramStageMetadataSchema = z.object({
    id: z.string({ required_error: 'Program stage id is missing in the API Payload.' }),
    displayName: z.string({ required_error: 'Program stage display name is missing in the API Payload.' }),
    program: z.object({
        id: z.string({ required_error: 'Program id is missing in the API Payload.' }),
    }),
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
                    fields: 'id,displayName,access[read,write,data[read,write]],trackedEntityType[id,displayName],programType,programStages[id,displayName]',
                    pageSize: 1000,
                }
            },
        });

        return ProgramMetadataSchema.array().parse(programsQuery.programs);
    }

    const getProgramStages = async () => {
        const { programStagesQuery }: any = await dataEngine.query({
            programStagesQuery: {
                resource: 'programStages',
                params: {
                    fields: 'id,displayName,program[id]',
                    pageSize: 2000,
                }
            },
        });

        console.log('Raw program stages data:', programStagesQuery);
        return ProgramStageMetadataSchema.array().parse(programStagesQuery.programStages);
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

    const { data: programStagesFromApi, error: programStagesError, isLoading: isLoadingProgramStages } = useQuery({
        queryKey: ['formFieldMetadata', 'programStages'],
        queryFn: getProgramStages,
        cacheTime: Infinity,
        staleTime: Infinity,
        onSuccess: (data) => {
            console.log('Successfully fetched program stages from API:', data?.length);
        }
    });

    // Extract program stages from programs as a backup
    const programStagesFromPrograms = useMemo(() => {
        if (!programs) return [];
        
        const stages: {
            id: string;
            displayName: string;
            program: {
                id: string;
            };
        }[] = [];
        
        programs.forEach(program => {
            if (program.programStages) {
                program.programStages.forEach(stage => {
                    stages.push({
                        id: stage.id,
                        displayName: stage.displayName,
                        program: {
                            id: program.id
                        }
                    });
                });
            }
        });
        
        console.log('Extracted program stages from programs:', stages.length);
        return stages;
    }, [programs]);
    
    // Combine program stages from both sources, preferring the API result if available
    const programStages = useMemo(() => {
        if (programStagesFromApi && programStagesFromApi.length > 0) {
            return programStagesFromApi;
        }
        return programStagesFromPrograms;
    }, [programStagesFromApi, programStagesFromPrograms]);

    const { data: trackedEntityTypes, error: tetError, isLoading: isLoadingTet } = useQuery({
        queryKey: ['formFieldMetadata', 'trackedEntityTypes'],
        queryFn: getTrackedEntityTypes,
        cacheTime: Infinity,
        staleTime: Infinity,
    });

    useEffect(() => {
        const errors = [programsError, programStagesError, tetError].filter(Boolean);
        if (errors.length > 0) {
            errors.forEach(error => console.error(error));
        }
    }, [programsError, programStagesError, tetError]);

    return {
        programs,
        programStages,
        trackedEntityTypes,
        isLoading: isLoadingPrograms || isLoadingProgramStages || isLoadingTet,
    }
}
