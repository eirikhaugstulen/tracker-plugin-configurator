import {z} from "zod";
import i18n from "@dhis2/d2-i18n";
import {EnrollmentPages} from "../EnrollmentOverview/AddEnrollmentPageConfig/AddEnrollmentPageConfig";

export const SettingsSchema = z.record(z.string(), z.object({
    dataStoreKey: z.string(),
    valueType: z.string(),
    label: z.string(),
}));

export const NativeWidgetSchema = z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    allowedPages: z.array(z.string()),
    settings: SettingsSchema.optional(),
})

export const WidgetsByNames = {
    QuickActions: 'QuickActions',
    StagesAndEvents: 'StagesAndEvents',
    NewEventWorkspace: 'NewEventWorkspace',
    EditEventWorkspace: 'EditEventWorkspace',
    WidgetAssignee: 'WidgetAssignee',
    ErrorWidget: 'ErrorWidget',
    WarningWidget: 'WarningWidget',
    EventComment: 'EventComment',
    EnrollmentNote: 'EnrollmentNote',
    FeedbackWidget: 'FeedbackWidget',
    IndicatorWidget: 'IndicatorWidget',
    TrackedEntityRelationship: 'TrackedEntityRelationship',
    ProfileWidget: 'ProfileWidget',
    EnrollmentWidget: 'EnrollmentWidget',
}

export const Widgets: Record<string, z.infer<typeof NativeWidgetSchema>> = {
    [WidgetsByNames.QuickActions]: {
        name: WidgetsByNames.QuickActions,
        title: i18n.t('Quick actions'),
        description: i18n.t('Simple actions to quickly navigate to common tasks'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW
        ],
    },
    [WidgetsByNames.StagesAndEvents]: {
        name: WidgetsByNames.StagesAndEvents,
        title: i18n.t('Stages and events'),
        description: i18n.t('Overview of all stages and events in the enrollment'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW
        ],
    },
    [WidgetsByNames.NewEventWorkspace]: {
        name: WidgetsByNames.NewEventWorkspace,
        title: i18n.t('New event workspace'),
        description: i18n.t('Workspace to create a new event'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_EVENT_NEW
        ],
    },
    [WidgetsByNames.EditEventWorkspace]: {
        name: WidgetsByNames.EditEventWorkspace,
        title: i18n.t('Edit event workspace'),
        description: i18n.t('Workspace to edit an event'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
    },
    [WidgetsByNames.WidgetAssignee]: {
        name: WidgetsByNames.WidgetAssignee,
        title: i18n.t('Assignee'),
        description: i18n.t('Assignee of the event'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
    },
    [WidgetsByNames.ErrorWidget]: {
        name: WidgetsByNames.ErrorWidget,
        title: i18n.t('Error widget'),
        description: i18n.t('Widget to display errors from program rules'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW,
            EnrollmentPages.ENROLLMENT_EVENT_NEW,
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
    },
    [WidgetsByNames.WarningWidget]: {
        name: WidgetsByNames.WarningWidget,
        title: i18n.t('Warning widget'),
        description: i18n.t('Widget to display warnings from program rules'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW,
            EnrollmentPages.ENROLLMENT_EVENT_NEW,
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
    },
    [WidgetsByNames.EventComment]: {
        name: WidgetsByNames.EventComment,
        title: i18n.t('Event comment'),
        description: i18n.t('Comments and notes for the event'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
    },
    [WidgetsByNames.EnrollmentNote]: {
        name: WidgetsByNames.EnrollmentNote,
        title: i18n.t('Enrollment note'),
        description: i18n.t('Notes for the enrollment'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW
        ],
    },
    [WidgetsByNames.FeedbackWidget]: {
        name: WidgetsByNames.FeedbackWidget,
        title: i18n.t('Feedback widget'),
        description: i18n.t('Widget to display feedback from program rules'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW,
            EnrollmentPages.ENROLLMENT_EVENT_NEW,
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
    },
    [WidgetsByNames.IndicatorWidget]: {
        name: WidgetsByNames.IndicatorWidget,
        title: i18n.t('Indicator widget'),
        description: i18n.t('Widget to display indicators from program rules'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW,
            EnrollmentPages.ENROLLMENT_EVENT_NEW,
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
    },
    [WidgetsByNames.TrackedEntityRelationship]: {
        name: WidgetsByNames.TrackedEntityRelationship,
        title: i18n.t('Tracked entity relationship'),
        description: i18n.t('Display, edit and create relationships between tracked entities'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW,
            EnrollmentPages.ENROLLMENT_EVENT_NEW,
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
    },
    [WidgetsByNames.ProfileWidget]: {
        name: WidgetsByNames.ProfileWidget,
        title: i18n.t('Profile widget'),
        description: i18n.t('Display and edit the profile of the tracked entity'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW,
            EnrollmentPages.ENROLLMENT_EVENT_NEW,
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
        settings: {
            readOnlyMode: {
                dataStoreKey: 'readOnlyMode',
                valueType: 'boolean',
                label: i18n.t('Read only mode')
            }
        }
    },
    [WidgetsByNames.EnrollmentWidget]: {
        name: WidgetsByNames.EnrollmentWidget,
        title: i18n.t('Enrollment widget'),
        description: i18n.t('Display and edit the enrollment details'),
        allowedPages: [
            EnrollmentPages.ENROLLMENT_OVERVIEW,
            EnrollmentPages.ENROLLMENT_EVENT_NEW,
            EnrollmentPages.ENROLLMENT_EVENT_EDIT
        ],
        settings: {
            readOnlyMode: {
                dataStoreKey: 'readOnlyMode',
                valueType: 'boolean',
                label: i18n.t('Read only mode')
            }
        }
    },
} as const;
