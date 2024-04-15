import React from "react";
import i18n from '@dhis2/d2-i18n';
import {CheckCheckIcon, MinusCircleIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../../../ui/tooltip";

type Props = {
    valid: boolean;
}

export const ValidationsIconCell = ({ valid }: Props) => {
    if (!valid) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={500}>
                    <TooltipTrigger>
                        <MinusCircleIcon className="h-4 w-4"/>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        {i18n.t('There is an error with this configuration. Please delete and create a new one.')}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger>
                    <CheckCheckIcon className={'w-4 h-4'} />
                </TooltipTrigger>
                <TooltipContent side="top">
                    {i18n.t('Configuration is valid')}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
