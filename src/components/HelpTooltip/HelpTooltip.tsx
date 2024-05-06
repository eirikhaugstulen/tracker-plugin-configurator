import React from 'react'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/tooltip";
import {HelpCircleIcon} from "lucide-react";

type Props = {
    content: string | React.ReactNode,
}

export const HelpTooltip = ({ content }: Props) => (
    <TooltipProvider>
        <Tooltip delayDuration={100}>
            <TooltipTrigger>
                <HelpCircleIcon className={'h-4 w-4'} />
            </TooltipTrigger>
            <TooltipContent>
                <p>
                    {content}
                </p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)
