import React from 'react'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/tooltip";
import {HelpCircleIcon} from "lucide-react";

type Props = {
    content: string | React.ReactNode,
    className?: string
}

export const HelpTooltip = ({ content, className }: Props) => (
    <TooltipProvider>
        <Tooltip delayDuration={100}>
            <TooltipTrigger>
                <HelpCircleIcon className={'h-4 w-4'} />
            </TooltipTrigger>
            <TooltipContent className={className}>
                <p>
                    {content}
                </p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)
