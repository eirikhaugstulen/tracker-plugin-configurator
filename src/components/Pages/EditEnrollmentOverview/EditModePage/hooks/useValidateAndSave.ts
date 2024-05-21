import {z} from "zod";
import {
    ApiDataStoreInfoPerProgram,
    ApiEnrollmentDataStoreSchema
} from "../../../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import {useQueryClient} from "@tanstack/react-query";
import {DataStoreKeyPerPage, useSaveEnrollmentForm} from "./useSaveEnrollmentForm";

type Props = {
    page: "overview" | "newEvent" | "editEvent"
    programId: string;
    onBack: () => void;
}

export const useValidateAndSave = ({ page, programId, onBack }: Props) => {
    const queryClient = useQueryClient();
    const { saveEnrollmentPageLayout, isSubmitting } = useSaveEnrollmentForm({ page, onBack });

    const save = (payload: z.infer<typeof ApiDataStoreInfoPerProgram>) => {
        const existingData = queryClient.getQueryData<z.infer<typeof ApiEnrollmentDataStoreSchema>>(
            ['enrollmentDataStoreConfigs']
        ) ?? {};

        const pageKey = DataStoreKeyPerPage[page];
        const existingDataForPage = existingData[pageKey];

        const newData =  {
            ...existingDataForPage,
            [programId]: payload,
        }

        saveEnrollmentPageLayout(newData);
    }

    return {
        save,
        isSubmitting,
    }
}
