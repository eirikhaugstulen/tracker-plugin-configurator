import React from "react";
import i18n from "@dhis2/d2-i18n";
import {TableHead, TableHeader, TableRow} from "../../../ui/table";

export const DataTableHeader = () => {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="hidden md:table-cell">{i18n.t('Program')}</TableHead>
                <TableHead className={'text-center'}>{i18n.t('Dashboard')}</TableHead>
                <TableHead className={'text-center'}>{i18n.t('New event')}</TableHead>
                <TableHead className={'text-center'}>{i18n.t('Edit event')}</TableHead>
                <TableHead>
                    <span className="sr-only">{i18n.t('Actions')}</span>
                </TableHead>
            </TableRow>
        </TableHeader>
    )
}
