import clsx from "clsx";
import React, { useMemo } from "react";
import i18n from '@dhis2/d2-i18n';
import { Table, TableBody, TableCell, TableRow } from "../../../ui/table";
import { Header } from "./Header";
import { Skeleton } from "../../../ui/skeleton";
import { FormFieldRecord, MetadataType, MetadataTypes } from "../hooks/useFormFieldConfig";
import { ActionsButton } from "./ActionsButton";
import { ValidationsIconCell } from "./ValidationsIconCell";
import { ArrowRightIcon, CornerDownRightIcon } from "lucide-react";

type Props = {
    records: FormFieldRecord[] | undefined,
    isLoading: boolean,
    isError: boolean,
}


const getMetadataTypeLabel = (type: MetadataType): string => {
    switch (type) {
        case MetadataTypes.trackerProgram:
            return i18n.t('Tracker Program');
        case MetadataTypes.eventProgram:
            return i18n.t('Event Program');
        case MetadataTypes.trackedEntityType:
            return i18n.t('Tracked Entity Type');
        case MetadataTypes.programStage:
            return i18n.t('Program Stage');
        default:
            return type;
    }
}

export const FormFieldTable = ({
    records,
    isLoading,
    isError,
}: Props) => {
    // Sort records to group program stages with their parent programs
    const sortedRecords = useMemo(() => {
        if (!records) return [];

        // First create a map of program IDs to program records
        const programMap = new Map<string, FormFieldRecord>();
        records.forEach(record => {
            if (record.metadataType === MetadataTypes.trackerProgram || record.metadataType === MetadataTypes.eventProgram) {
                programMap.set(record.id, record);
            }
        });

        // Create a map to store program stages by parent program ID
        const programStagesByProgram = new Map<string, FormFieldRecord[]>();

        // Categorize records
        const programStages: FormFieldRecord[] = [];
        const programs: FormFieldRecord[] = [];
        const trackedEntityTypes: FormFieldRecord[] = [];

        records.forEach(record => {
            if (record.metadataType === MetadataTypes.programStage) {
                programStages.push(record);

                // Group by parent program
                if (record.parentId) {
                    const existing = programStagesByProgram.get(record.parentId) || [];
                    programStagesByProgram.set(record.parentId, [...existing, record]);
                }
            } else if (record.metadataType === MetadataTypes.trackerProgram || record.metadataType === MetadataTypes.eventProgram) {
                programs.push(record);
            } else if (record.metadataType === MetadataTypes.trackedEntityType) {
                trackedEntityTypes.push(record);
            }
        });

        // Create sorted list with programs followed by their stages
        const sorted: FormFieldRecord[] = [];

        // Add programs with their stages
        programs.forEach(program => {
            sorted.push(program);
            const stages = programStagesByProgram.get(program.id) || [];
            stages.sort((a, b) => a.sortOrder - b.sortOrder);
            sorted.push(...stages);
        });

        // Add orphaned program stages (those without a program in the records)
        const orphanedStages = programStages.filter(stage =>
            !programMap.has(stage.parentId || '')
        );
        sorted.push(...orphanedStages);

        // Add tracked entity types at the end
        sorted.push(...trackedEntityTypes);

        return sorted;
    }, [records]);

    if (isLoading) {
        return (
            <Table className={'rounded-md border'}>
                <Header />
                <TableBody>
                    {Array.from({ length: 3 }).map((_, index) => (
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
                {sortedRecords.map((record) => {
                    const isProgramStage = record.metadataType === MetadataTypes.programStage;
                    const isInvalid = !record.valid;

                    let rowClassName = clsx(
                        'cursor-pointer',
                        isInvalid && 'bg-gray-100 italic text-gray-600',
                        isProgramStage && 'bg-gray-50'
                    );


                    return (
                        <TableRow
                            key={record.id}
                            className={rowClassName}
                        >
                            <TableCell>
                                {isProgramStage && record.parentName ? (
                                    <div className="flex items-center relative">
                                        {record.parentHasConfiguration && (
                                            <CornerDownRightIcon className="h-4 w-4 -mt-1 mr-1 text-gray-400" />
                                        )}
                                        <span>{record.name}</span>
                                    </div>
                                ) : (
                                    <div className="font-medium">{record.name}</div>
                                )}
                            </TableCell>
                            <TableCell>
                                {isProgramStage && record.parentName ? (
                                    <div className="flex items-center text-sm">
                                        <span className="text-gray-500 mr-1">{record.parentName}</span>
                                        <ArrowRightIcon className="h-3 w-3 text-gray-400 mx-1" />
                                        <span>{getMetadataTypeLabel(record.metadataType)}</span>
                                    </div>
                                ) : (
                                    getMetadataTypeLabel(record.metadataType)
                                )}
                            </TableCell>

                            <TableCell align={'center'}>
                                <ValidationsIconCell
                                    valid={record.valid}
                                />
                            </TableCell>

                            <TableCell align={'right'}>
                                <ActionsButton
                                    id={record.id}
                                    metadataType={record.metadataType}
                                    parentId={record.parentId}
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    )
}
