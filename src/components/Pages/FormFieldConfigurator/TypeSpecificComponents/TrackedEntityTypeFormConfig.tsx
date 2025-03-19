import React, { useMemo } from "react";
import i18n from '@dhis2/d2-i18n';
import { useMetadataFromType } from "../hooks/useMetadataFromType/useMetadataFromType";
import { FormController } from "../FormController";
import { useInstanceApps } from "../hooks/useInstanceApps";
import { MetadataTypes, useFormFieldConfig } from "../../FormFieldPlugins/hooks/useFormFieldConfig";
import { Loading } from "../Loading";

interface Props {
    formFieldId: string;
}

export const TrackedEntityTypeFormConfig: React.FC<Props> = ({ formFieldId }) => {
    // Fetch tracked entity type specific metadata
    const { metadata, isLoading, isError } = useMetadataFromType({
        resourceId: formFieldId,
        metadataType: MetadataTypes.trackedEntityType,
    });

    const { apps, isLoading: isLoadingApps, isError: isErrorApps } = useInstanceApps();
    const {
        records,
        isLoading: isLoadingConfig,
        isError: isErrorConfig,
    } = useFormFieldConfig();

    const existingFormFieldConfig = useMemo(() => {
        if (!records) return null;
        return records.find(record => record.id === formFieldId);
    }, [records, formFieldId]);

    if (isLoading || isLoadingApps || isLoadingConfig) {
        return <Loading />;
    }

    if (isError || isErrorApps || isErrorConfig || !metadata || !apps) {
        return (
            <div className={'w-3/4 mt-4 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/3 px-4 py-6'}>
                {i18n.t('There seems to be an unexpected error. Please refresh the app and try again.')}
            </div>
        );
    }

    return (
        <div className={'px-4 space-y-4'}>
            <FormController
                metadata={metadata}
                formFieldId={formFieldId}
                apps={apps}
                existingFormFieldConfig={existingFormFieldConfig}
            />
        </div>
    );
}; 