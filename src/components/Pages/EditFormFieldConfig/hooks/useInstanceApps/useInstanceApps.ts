import {useQuery} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";
import {z} from "zod";

export const appsSchema = z.object({
    name: z.string(),
    key: z.string(),
    pluginLaunchUrl: z.string(),
    description: z.string().optional(),
    version: z.string().optional()
})

export const useInstanceApps = () => {
    const dataEngine = useDataEngine();

    const fetchApps = async () => {
        const { apps } = await dataEngine.query({
            apps: {
                resource: 'apps',
                params: {
                    fields: 'name,key,pluginLaunchUrl,description,version',
                }
            }
        });

        return z.array(appsSchema).parse(apps);
    }
    const { data, isError, isLoading } = useQuery({
        queryKey: ['apps'],
        queryFn: fetchApps,
        staleTime: Infinity,
        cacheTime: Infinity,
    });

    return {
        apps: data,
        isError,
        isLoading,
    }
}
