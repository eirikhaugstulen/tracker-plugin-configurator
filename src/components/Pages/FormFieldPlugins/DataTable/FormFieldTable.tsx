import React from "react";
import i18n from '@dhis2/d2-i18n';
import {Table, TableBody, TableCell, TableRow} from "../../../ui/table";
import {Header} from "./Header";
import {Skeleton} from "../../../ui/skeleton";
import {FormFieldRecord} from "../hooks/useFormFieldConfig";
import {ActionsButton} from "./ActionsButton";
import {ValidationsIconCell} from "./ValidationsIconCell";

type Props = {
    records: FormFieldRecord[] | undefined,
    isLoading: boolean,
    isError: boolean,
}

export const FormFieldTable = ({
    records,
    isLoading,
    isError,
}: Props) => {
    if (isLoading) {
        return (
            <Table className={'rounded-md border'}>
                <Header />
                <TableBody>
                    {Array.from({length: 3}).map((_, index) => (
                        <TableRow
                            key={index}
                        >
                            <TableCell>
                                <Skeleton className={'h-7'} />
                            </TableCell>
                            <TableCell>
                                <Skeleton className={'h-7'} />
                            </TableCell>
                            <TableCell>
                                <Skeleton className={'h-7'} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    if (isError) {
        return (
            <Table className={'rounded-md border'}>
                <Header />
                <TableBody>
                    <TableRow>
                        <TableCell align={'center'} colSpan={4}>
                            <p className={'text-gray-700'}>{i18n.t('Something went wrong while fetching the configurations. Please try again later.')}</p>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    if (!records || records.length === 0) {
        return (
            <Table className={'rounded-md border'}>
                <Header />
                <TableBody>
                    <TableRow>
                        <TableCell align={'center'} colSpan={4}>
                            <p className={'text-gray-700'}>{i18n.t('It looks like you don\'t have any existing configurations. Get started by clicking the button in the right hand corner!')}</p>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    return (
        <Table className={'rounded-md border'}>
            <Header />
            <TableBody>
                {records.map((record) => (
                    <TableRow
                        key={record.id}
                        className={`cursor-pointer ${record.valid ? '' : 'bg-gray-100 italic text-gray-600'}`}
                    >
                        <TableCell>{record.program.displayName}</TableCell>
                        <TableCell>{record.trackedEntityType.displayName}</TableCell>

                        <TableCell align={'center'}>
                            <ValidationsIconCell
                                valid={record.valid}
                            />
                        </TableCell>

                        <TableCell align={'right'}>
                            <ActionsButton
                                id={record.id}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
