import {z} from "zod";
import i18n from "@dhis2/d2-i18n";
import {useDataEngine} from "@dhis2/app-runtime";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {useProgramsWithMetadataAccess} from "../../../../lib/hooks/useProgramsWithMetadataAccess";

const ApiPluginSchema = z.object({
    type: z.literal('plugin'),
    source: z.string().min(1),
    settings: z.record(z.string(), z.any()).optional(),
});

const ApiNativeComponent = z.object({
    type: z.literal('component'),
    name: z.string().min(1),
    settings: z.record(z.string(), z.any()).optional(),
});

export const ApiColumnSchema = z.array(
    z.union([ApiPluginSchema, ApiNativeComponent])
);

export const ApiDataStoreInfoPerProgram = z.object({
    title: z.string().optional(),
    leftColumn: ApiColumnSchema.optional(),
    rightColumn: ApiColumnSchema.optional(),
}).refine(data => data.title || data.leftColumn || data.rightColumn, {
    message: i18n.t('At least one of title, leftColumn, or rightColumn must be defined'),
});

export const ApiEnrollmentDataStoreSchema = z.record(z.string(), ApiDataStoreInfoPerProgram);

export const FormattedEnrollmentDataStoreInfo = z.object({
    id: z.string(),
    displayName: z.string(),
    overview: z.object({
        valid: z.boolean(),
        defined: z.boolean(),
        data: ApiDataStoreInfoPerProgram.optional(),
    }),
    newEvent: z.object({
        valid: z.boolean(),
        defined: z.boolean(),
        data: ApiDataStoreInfoPerProgram.optional(),
    }),
    editEvent: z.object({
        valid: z.boolean(),
        defined: z.boolean(),
        data: ApiDataStoreInfoPerProgram.optional(),
    }),
});

export interface RawDataStoreConfigs {
    enrollmentOverviewLayout: z.infer<typeof ApiEnrollmentDataStoreSchema>;
    enrollmentEventNewLayout: z.infer<typeof ApiEnrollmentDataStoreSchema>;
    enrollmentEventEditLayout: z.infer<typeof ApiEnrollmentDataStoreSchema>;
}

export const useEnrollmentDataStoreInfo = () => {
    const dataEngine = useDataEngine();
    const { programs, isLoading: isLoadingPrograms } = useProgramsWithMetadataAccess();

    const fetchEnrollmentDataStoreConfigs = async (): Promise<RawDataStoreConfigs> => {
        const response = await dataEngine.query({
            enrollmentOverviewLayout: {
                resource: 'dataStore/capture',
                id: 'enrollmentOverviewLayout'
            },
            enrollmentEventNewLayout: {
                resource: 'dataStore/capture',
                id: 'enrollmentEventNewLayout'
            },
            enrollmentEventEditLayout: {
                resource: 'dataStore/capture',
                id: 'enrollmentEventEditLayout'
            }
        }) as unknown;

        return {
            enrollmentOverviewLayout: (response as any).enrollmentOverviewLayout ?? {},
            enrollmentEventNewLayout: (response as any).enrollmentEventNewLayout ?? {},
            enrollmentEventEditLayout: (response as any).enrollmentEventEditLayout ?? {},
        };
    }

    const formatRecords = useMemo(() => {
        return (rawData: RawDataStoreConfigs) => {
            if (!programs) {
                throw new Error('Could not get programs');
            }

            const {
                enrollmentOverviewLayout = {},
                enrollmentEventNewLayout = {},
                enrollmentEventEditLayout = {},
            } = rawData;

            return programs
                .map(({ id: programId, displayName }) => {
                    const overview = enrollmentOverviewLayout[programId];
                    const newEvent = enrollmentEventNewLayout[programId];
                    const editEvent = enrollmentEventEditLayout[programId];

                    if (!overview && !newEvent && !editEvent) return null;

                    return {
                        id: programId,
                        displayName,
                        overview: {
                            valid: ApiDataStoreInfoPerProgram.safeParse(overview).success,
                            defined: !!overview,
                            data: overview,
                        },
                        newEvent: {
                            valid: ApiDataStoreInfoPerProgram.safeParse(newEvent).success,
                            defined: !!newEvent,
                            data: newEvent,
                        },
                        editEvent: {
                            valid: ApiDataStoreInfoPerProgram.safeParse(editEvent).success,
                            defined: !!editEvent,
                            data: editEvent,
                        },
                    };
                })
                .filter(Boolean);
        };
    }, [programs]);

    const { data: rawData, isLoading, isError } = useQuery({
        queryKey: ['enrollmentDataStoreConfigs'] as const,
        queryFn: fetchEnrollmentDataStoreConfigs,
        staleTime: Infinity,
        cacheTime: Infinity,
        enabled: !isLoadingPrograms,
    });

    const records = useMemo(() => {
        if (!rawData) return [];
        return formatRecords(rawData);
    }, [rawData, formatRecords]);

    return {
        records: records as Array<z.infer<typeof FormattedEnrollmentDataStoreInfo>>,
        rawData,
        isLoading,
        isError,
    }
}
