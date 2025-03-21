import {z} from "zod";
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
            name: 'EnrollmentNote',
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
            name: 'EventNote',
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

export const DefaultPageLayout = {
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
