import React, { useState, useCallback, useMemo, memo } from "react";
import { ChevronDown, Download } from "lucide-react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import i18n from "@dhis2/d2-i18n";
import { RawDataStoreConfigs, useEnrollmentDataStoreInfo } from "../Pages/EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import { ExportDialog } from "../export-dialog";

type ExportType = 'overview' | 'addEvent' | 'editEvent';

interface ExportConfig {
    title: string;
    description: string;
    dataKey: keyof RawDataStoreConfigs;
}

const isEmptyData = (data: unknown): boolean => {
    if (data === undefined || data === null) return true;
    if (typeof data === 'object' && !Array.isArray(data)) {
        return Object.keys(data as object).length === 0;
    }
    return false;
};

const EXPORT_CONFIGS: Record<ExportType, ExportConfig> = {
    overview: {
        title: i18n.t('Export Enrollment Overview'),
        description: i18n.t('Review your enrollment overview configuration before exporting.'),
        dataKey: 'enrollmentOverviewLayout'
    },
    addEvent: {
        title: i18n.t('Export Add Event Page'),
        description: i18n.t('Review your add event page configuration before exporting.'),
        dataKey: 'enrollmentEventNewLayout'
    },
    editEvent: {
        title: i18n.t('Export Edit Event Page'),
        description: i18n.t('Review your edit event page configuration before exporting.'),
        dataKey: 'enrollmentEventEditLayout'
    }
} as const;

interface ExportMenuItemProps {
    type: ExportType;
    disabled: boolean;
    onClick: (type: ExportType) => void;
    label: string;
}

const ExportMenuItem = memo(({ type, disabled, onClick, label }: ExportMenuItemProps) => (
    <DropdownMenuItem
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => onClick(type)}
        disabled={disabled}
    >
        <Download className="size-4" />
        <span>{label}</span>
    </DropdownMenuItem>
));

ExportMenuItem.displayName = 'ExportMenuItem';

const MemoizedExportDialog = memo(ExportDialog);

export const ExportDropdown: React.FC = () => {
    const { rawData, isLoading, isError } = useEnrollmentDataStoreInfo();
    const [isOpen, setIsOpen] = useState(false);
    const [currentExport, setCurrentExport] = useState<ExportType>('overview');

    const handleExportClick = useCallback((type: ExportType) => {
        setCurrentExport(type);
        setIsOpen(true);
    }, []);

    const menuItems = useMemo(() => {
        if (!rawData) return [];

        return (Object.keys(EXPORT_CONFIGS) as ExportType[]).map((type) => ({
            type,
            disabled: isEmptyData(rawData[EXPORT_CONFIGS[type].dataKey]),
            label: type === 'overview'
                ? i18n.t('Enrollment Overview')
                : type === 'addEvent'
                    ? i18n.t('Add Event Page')
                    : i18n.t('Edit Event Page')
        }));
    }, [rawData]);

    const dialogProps = useMemo(() => {
        const data = rawData?.[EXPORT_CONFIGS[currentExport].dataKey];
        return {
            data: data || {},
            title: EXPORT_CONFIGS[currentExport].title,
            description: EXPORT_CONFIGS[currentExport].description,
            open: isOpen,
            onOpenChange: setIsOpen
        };
    }, [rawData, currentExport, isOpen]);

    if (isLoading || isError || !rawData) {
        return null;
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1" size="sm">
                        {i18n.t('Export')}
                        <ChevronDown className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {menuItems.map(({ type, disabled, label }) => (
                        <ExportMenuItem
                            key={type}
                            type={type}
                            disabled={disabled}
                            onClick={handleExportClick}
                            label={label}
                        />
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <MemoizedExportDialog {...dialogProps} />
        </>
    );
}; 