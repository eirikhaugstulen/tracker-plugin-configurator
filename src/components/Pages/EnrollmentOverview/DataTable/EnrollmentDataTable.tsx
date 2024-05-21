import React from "react";
import i18n from "@dhis2/d2-i18n";
import {TableBody, TableCell, TableRow} from "../../../ui/table";
import {CheckCircleIcon, MinusCircleIcon} from "lucide-react";
import {useEnrollmentDataStoreInfo} from "../hooks/useEnrollmentDataStoreInfo";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../../../ui/tooltip";
import {Skeleton} from "../../../ui/skeleton";
import {ActionsButton} from "./ActionsButton";

const IconTableCell = ({ valid, defined }: { valid: boolean, defined: boolean }) => {
    if (!defined) {
        return (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger>
                        <p>-</p>
                    </TooltipTrigger>
                    <TooltipContent>
                        {i18n.t('You are using the default layout')}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    if (valid) {
        return (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger>
                        <CheckCircleIcon
                            className={'w-4 h-4'}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        {i18n.t('Valid configuration')}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger>
                    <MinusCircleIcon
                        className={'text-red-500 w-4 h-4'}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    {i18n.t('It looks like there is an issue with this configuration. Please review or update it.')}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export const EnrollmentDataTable = () => {
    const { records, isLoading, isError } = useEnrollmentDataStoreInfo();

    if (isLoading) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={5}>
                        <Skeleton className={'h-5'} />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={5}>
                        <Skeleton className={'h-5'} />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={5}>
                        <Skeleton className={'h-5'} />
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    if (isError) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={5} className={'text-center'}>
                        <p>
                            {i18n.t('Something went wrong while fetching the configurations. Please try again later.')}
                        </p>
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    if (!records || records.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={5} className={'text-center'}>
                        <p>
                            {i18n.t('It looks like you don\'t have any existing configurations. Get started by clicking the button in the right hand corner!')}
                        </p>
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    return (
        <TableBody>
            {records.map(record => {
                const { id, displayName, overview, newEvent, editEvent } = record;
                return (
                    <TableRow
                        key={id}
                    >
                        <TableCell className="hidden md:table-cell">{displayName}</TableCell>
                        <TableCell align={'center'}>
                            <IconTableCell
                                valid={overview.valid}
                                defined={overview.defined}
                            />
                        </TableCell>
                        <TableCell align={'center'}>
                            <IconTableCell
                                valid={newEvent.valid}
                                defined={newEvent.defined}
                            />
                        </TableCell>
                        <TableCell align={'center'}>
                            <IconTableCell
                                valid={editEvent.valid}
                                defined={editEvent.defined}
                            />
                        </TableCell>
                        <TableCell className={'text-right'}>
                            <ActionsButton
                                id={id}
                            />
                        </TableCell>
                    </TableRow>
                )}
            )}
        </TableBody>
    )
}
