import i18n from '@dhis2/d2-i18n';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";
import {z} from "zod";
import {ApiDataStoreInfoPerProgram} from "./useEnrollmentDataStoreInfo";
import {toast} from "sonner";

type MutationParams = {
    id: string;
}

export const useDeleteEnrollmentConfig = () => {
    const queryClient = useQueryClient();
    const dataEngine = useDataEngine();

    const { mutate, isLoading } = useMutation({
        mutationFn: async ({ id }: MutationParams) => {
            const {
                enrollmentOverviewLayout,
                enrollmentEventNewLayout,
                enrollmentEventEditLayout,
            } = await dataEngine.query({
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
            }) as Record<string, Record<string, z.infer<typeof ApiDataStoreInfoPerProgram>>>;

            let mutationPromises = [];

            if (enrollmentOverviewLayout?.[id]) {
                delete enrollmentOverviewLayout[id];

                mutationPromises.push(dataEngine.mutate({
                    type: 'update',
                    resource: 'dataStore/capture',
                    id: 'enrollmentOverviewLayout',
                    data: enrollmentOverviewLayout,
                }));
            }

            if (enrollmentEventNewLayout?.[id]) {
                delete enrollmentEventNewLayout[id];

                mutationPromises.push(dataEngine.mutate({
                    type: 'update',
                    resource: 'dataStore/capture',
                    id: 'enrollmentEventNewLayout',
                    data: enrollmentEventNewLayout,
                }));
            }

            if (enrollmentEventEditLayout?.[id]) {
                delete enrollmentEventEditLayout[id];

                mutationPromises.push(dataEngine.mutate({
                    type: 'update',
                    resource: 'dataStore/capture',
                    id: 'enrollmentEventEditLayout',
                    data: enrollmentEventEditLayout,
                }));
            }

            return Promise.all(mutationPromises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['enrollmentDataStoreConfigs']);
            toast.success(i18n.t('Configuration deleted successfully'));
        },
        onError: () => {
            toast.error(i18n.t('Failed to delete configuration'));
        }
    })

    return {
        deleteEnrollmentConfig: mutate,
        isSubmitting: isLoading,
    }
}
