import i18n from "@dhis2/d2-i18n";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useDataEngine} from "@dhis2/app-runtime";
import {z} from "zod";
import {
    ApiDataStoreInfoPerProgram,
} from "../../../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import {toast} from "sonner";

type Props = {
    page: "overview" | "newEvent" | "editEvent"
    onBack: () => void;
}

export const DataStoreKeyPerPage = {
    overview: 'enrollmentOverviewLayout',
    newEvent: 'enrollmentEventNewLayout',
    editEvent: 'enrollmentEventEditLayout',
}

export const useSaveEnrollmentForm = ({ page, onBack }: Props) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation({
        mutationFn: (payload: z.infer<typeof ApiDataStoreInfoPerProgram>) => dataEngine.mutate({
            resource: 'dataStore/capture',
            type: 'update',
            data: payload,
            id: DataStoreKeyPerPage[page],
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['enrollmentDataStoreConfigs']);
            toast.success(i18n.t('Enrollment configuration saved'));
            onBack();
        },
        onError: (error) => {
            console.error(error);
            toast.error(i18n.t('Failed to save enrollment configuration'));
        },
    });

    return {
        saveEnrollmentPageLayout: mutate,
        isSubmitting: isLoading,
    }
}
