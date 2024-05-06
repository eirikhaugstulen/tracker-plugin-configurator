import {useDataEngine} from "@dhis2/app-runtime";
import {useQuery} from "@tanstack/react-query";
import {z} from "zod";
import {useEffect} from "react";

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
});

export const useFormFieldMetadata = () => {
    const dataEngine = useDataEngine();

    const getPrograms = async () => {
        const { programsQuery }: any = await dataEngine.query({
            programsQuery: {
                resource: 'programs',
                params: {
                    fields: 'id,displayName,access[read,write,data[read,write]],trackedEntityType[id,displayName],programType',
                    pageSize: 1000,
                }
            },
        });

        return ProgramMetadataSchema.array().parse(programsQuery.programs);
    }
    const { isLoading, data: programs, error } = useQuery({
        queryKey: ['formFieldMetadata', 'programs'],
        queryFn: getPrograms,
        cacheTime: Infinity,
        staleTime: Infinity,
    })

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error])

    return {
        programs,
        isLoading,
    }
}
