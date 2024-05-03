import React from "react";
import {useMetadataFromType} from "./hooks/useMetadataFromType/useMetadataFromType";
import {FormController} from "./FormController";
import {useInstanceApps} from "./hooks/useInstanceApps";
import {useFormFieldConfig} from "../FormFieldPlugins/hooks/useFormFieldConfig";

type Props = {
    formFieldId: string,
    metadataType: 'program' | 'trackedEntityType',
}

export const EditFormFieldConfig = ({
    formFieldId,
    metadataType,
}: Props) => {
    const { metadata, isLoading, isError } = useMetadataFromType({ resourceId: formFieldId, metadataType })
    const { apps, isLoading: isLoadingApps, isError: isErrorApps } = useInstanceApps();
    const {} = useFormFieldConfig();

    if (isLoading || isLoadingApps) {
        return <div>Loading...</div>
    }

    if (isError || isErrorApps || !metadata || !apps) {
        return <div>Error...</div>
    }

    return (
        <div className={'px-4 space-y-4'}>
            <FormController
                metadata={metadata}
                formFieldId={formFieldId}
                metadataType={metadataType}
                apps={apps}
            />
        </div>
    )
}
