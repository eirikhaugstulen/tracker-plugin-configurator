import {toast} from "sonner";
import i18n from "@dhis2/d2-i18n";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";

type ApiFormConfig = {
    id: string,
    name: string,
    elements: Array<{ id: string, type: string }>
}

export const useDeleteFormConfig = () => {
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            const { query } = await dataEngine.query({
                query: {
                    resource: 'dataStore/capture',
                    id: 'dataEntryForms',
                }
            }) as { query: Record<string, ApiFormConfig> };

            if (query[id]) {
                delete query[id];
            }

            return dataEngine.mutate({
                type: 'update',
                resource: 'dataStore/capture',
                id: 'dataEntryForms',
                data: query,
            });
        },
        onSuccess: () => {
            // const previousData = queryClient.getQueryData(['formFieldConfig']);
            queryClient.invalidateQueries(['formFieldConfig'])
            toast.success(i18n.t('Configuration deleted successfully'), {
                // action: {
                //     label: i18n.t('Undo'),
                //     onClick: () => {
                //         queryClient.setQueryData(['formFieldConfig'], previousData);
                //     }
                // }
            });
        }
    })

    return {
        deleteFormConfig: mutateAsync,
        isSubmitting: isLoading,
    }
}
