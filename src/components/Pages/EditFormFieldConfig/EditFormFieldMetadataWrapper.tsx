import React from "react";
import i18n from '@dhis2/d2-i18n';
import {useParams} from "react-router-dom";
import {useValidatedFormFieldId} from "../../../lib/hooks/useValidatedFormFieldId";
import {EditFormFieldConfig} from "./EditFormFieldConfig";

export const EditFormFieldMetadataWrapper = () => {
    const { formFieldId } = useParams();
    const {
        validatedFormFieldId,
        metadataType,
        isLoading,
        isError,
    } = useValidatedFormFieldId({ formFieldId });

    if (isLoading) {
        return (
            <div>
                {i18n.t('Loading...')}
            </div>
        )
    }

    if (isError) {
        return (
            <div>
                {i18n.t('An error occurred')}
            </div>
        )
    }

    if (!validatedFormFieldId || !metadataType) {
        return (
            <div>
                {i18n.t('Could not find the program or tracked entity type with the provided ID. Are you sure you have access?')}
            </div>
        )
    }

    return (
        <EditFormFieldConfig
            formFieldId={validatedFormFieldId}
            metadataType={metadataType}
        />
    )
}
