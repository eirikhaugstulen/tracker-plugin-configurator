import React from "react";
import i18n from "@dhis2/d2-i18n";
import { useParams } from "react-router-dom";
import { useValidatedContextId } from "../../../lib/hooks/useValidatedContextId";
import { EditEnrollmentOverview } from "./EditEnrollmentOverview";
import { useEnrollmentDataStoreInfo } from "../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import { useInstanceApps } from "../FormFieldConfigurator/hooks/useInstanceApps";
import { MetadataTypes } from "../FormFieldPlugins/hooks/useFormFieldConfig";

export const EditEnrollmentOverviewWrapper = () => {
    const { contextId } = useParams();
    const {
        validatedContextId,
        metadataType,
        isLoading: isLoadingContextId,
        isError: isErrorContextId,
    } = useValidatedContextId({ contextId: contextId });
    const {
        records,
        isLoading: isLoadingDataStoreInfo,
        isError: isErrorDataStoreInfo,
    } = useEnrollmentDataStoreInfo();
    const {
        apps,
        isError: isErrorApps,
        isLoading: isLoadingApps,
    } = useInstanceApps();


    const currentRecord = records?.find(record => record.id === contextId);

    if (isLoadingContextId || isLoadingDataStoreInfo || isLoadingApps) {
        return (
            <div className={'w-3/4 mt-4 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/3 px-4 py-6'}>
                <p>
                    {i18n.t('Loading...')}
                </p>
            </div>
        )
    }

    if (isErrorContextId || isErrorDataStoreInfo || isErrorApps || !apps) {
        return (
            <div className={'w-3/4 mt-4 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/3 px-4 py-6'}>
                {i18n.t('There seems to be an unexpected error. Please refresh the app and try again.')}
            </div>
        )
    }

    if (!validatedContextId || !metadataType) {
        return (
            <div className={'w-3/4 mt-4 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/3 px-4 py-6'}>
                <p>{i18n.t('Could not find the program or tracked entity type with the provided ID.')}</p>
                <p>{i18n.t('Are you sure you have access?')}</p>
            </div>
        )
    }

    if (metadataType !== MetadataTypes.trackerProgram) {
        return (
            <div className={'w-3/4 mt-4 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/3 px-4 py-6'}>
                <p>{i18n.t('Enrollment plugins are only available for tracker programs.')}</p>
            </div>
        )
    }

    return (
        <EditEnrollmentOverview
            programId={validatedContextId}
            record={currentRecord}
            apps={apps}
        />
    )

}
