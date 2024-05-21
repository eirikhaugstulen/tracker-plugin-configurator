import {z} from "zod";
import i18n from "@dhis2/d2-i18n";
import {
    ApiDataStoreInfoPerProgram, FormattedEnrollmentDataStoreInfo,
} from "../../../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import {useState} from "react";

type Props = {
    record: z.infer<typeof FormattedEnrollmentDataStoreInfo> | undefined;
    page: "overview" | "newEvent" | "editEvent"
}

export const WidgetTypes = {
    COMPONENT: 'component',
    PLUGIN: 'plugin',
} as const;

export const DefaultOverviewPageLayout: z.infer<typeof ApiDataStoreInfoPerProgram> = {
    title: i18n.t('Enrollment Dashboard'),
    leftColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'QuickActions',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'StagesAndEvents',
        },
    ],
    rightColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'ErrorWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'WarningWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EnrollmentComment',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'FeedbackWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'IndicatorWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'TrackedEntityRelationship',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'ProfileWidget',
            settings: { readOnlyMode: false },
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EnrollmentWidget',
            settings: { readOnlyMode: false },
        },
    ],
}

const DefaultEventNewPageLayout: z.infer<typeof ApiDataStoreInfoPerProgram> = {
    title: i18n.t('Enrollment Dashboard{{escape}} New event', { escape: ':' }),
    leftColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'NewEventWorkspace',
        },
    ],
    rightColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'ErrorWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'WarningWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'FeedbackWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'IndicatorWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'TrackedEntityRelationship',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'ProfileWidget',
            settings: { readOnlyMode: true },
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EnrollmentWidget',
            settings: { readOnlyMode: true },
        },
    ],
}

const DefaultEventEditPageLayout: z.infer<typeof ApiDataStoreInfoPerProgram> = {
    title: i18n.t('Enrollment Dashboard{{escape}} Edit event', { escape: ':' }),
    leftColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'EditEventWorkspace',
        },
    ],
    rightColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'WidgetAssignee',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EventComment',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'ErrorWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'WarningWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'FeedbackWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'IndicatorWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'TrackedEntityRelationship',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'ProfileWidget',
            settings: { readOnlyMode: true },
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EnrollmentWidget',
            settings: { readOnlyMode: true },
        },
    ],
}

const DefaultPageLayout = {
    overview: DefaultOverviewPageLayout,
    newEvent: DefaultEventNewPageLayout,
    editEvent: DefaultEventEditPageLayout,
}

export const useDefaultValues = ({ record, page }: Props) => {
    const [existingData] = useState(record?.[page]?.data ?? DefaultPageLayout[page]);

    return {
        existingData,
    }
}
