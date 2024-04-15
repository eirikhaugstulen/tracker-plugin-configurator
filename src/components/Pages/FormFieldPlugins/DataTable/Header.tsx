import React from "react";
import i18n from '@dhis2/d2-i18n';
import {TableHead, TableHeader, TableRow} from "../../../ui/table";

export const Header = () => {

    return (
        <TableHeader>
            <TableRow>
                <TableHead>{i18n.t('Program')}</TableHead>
                <TableHead>{i18n.t('Tracked Entity Type')}</TableHead>
                <TableHead className={'text-center'}>{i18n.t('Validation')}</TableHead>
                <TableHead>
                    <span className="sr-only">{i18n.t('Actions')}</span>
                </TableHead>
            </TableRow>
        </TableHeader>
    )
}
