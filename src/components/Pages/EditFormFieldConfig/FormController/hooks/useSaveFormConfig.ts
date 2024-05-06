import i18n from '@dhis2/d2-i18n'
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";
import {z} from "zod";
import { toast } from "sonner"
import {ContextFormSchema} from "./useValidateAndSave";
import {useNavigate} from "react-router-dom";

export const useSaveFormConfig = () => {
    const queryClient = useQueryClient();
    const dataEngine = useDataEngine();
    const navigate = useNavigate();

    const { mutate, isLoading, isError } = useMutation({
        mutationFn: (payload: Record<string, z.infer<typeof ContextFormSchema>>) => dataEngine.mutate({
            resource: 'dataStore/capture',
            type: 'update',
            id: 'dataEntryForms',
            data: payload,
        }),
        onSuccess: () => {
            toast.success(i18n.t('Configuration saved successfully'));
            navigate('/formField')
            queryClient.invalidateQueries(['formFieldConfig'])
        }
    })

    return {
        saveFormConfig: mutate,
        isSubmitting: isLoading,
        isError,
    }
}
