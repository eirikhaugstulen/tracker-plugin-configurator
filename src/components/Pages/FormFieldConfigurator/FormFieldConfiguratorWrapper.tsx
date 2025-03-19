import React from "react";
import i18n from '@dhis2/d2-i18n';
import { useParams } from "react-router-dom";
import { useValidatedContextId } from "../../../lib/hooks/useValidatedContextId";
import { Loading } from "./Loading";
import { FormFieldConfigurator } from "./FormFieldConfigurator";

export const FormFieldConfiguratorWrapper = () => {
    const { formFieldId } = useParams();
    const {
        validatedContextId,
        metadataType,
        isLoading,
        isError,
    } = useValidatedContextId({ contextId: formFieldId });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <div className={'w-3/4 mt-4 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/3 px-4 py-6'}>
                {i18n.t('There seems to be an unexpected error. Please refresh the app and try again.')}
            </div>
        );
    }

    if (!validatedContextId || !metadataType) {
        return (
            <div className={'w-3/4 mt-4 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/3 px-4 py-6'}>
                <p>{i18n.t('Could not find the program, event program or tracked entity type with the provided ID.')}</p>
                <p>{i18n.t('Are you sure you have access?')}</p>
            </div>
        );
    }

    return (
        <FormFieldConfigurator
            formFieldId={validatedContextId}
            metadataType={metadataType}
        />
    );
} 