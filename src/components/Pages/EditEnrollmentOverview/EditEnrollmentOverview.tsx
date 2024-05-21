import React, {useMemo} from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    FormattedEnrollmentDataStoreInfo,
} from "../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import {z} from "zod";
import {useNavigate, useSearchParams} from "react-router-dom";
import {CardContent} from "../../ui/card";
import {EditModePage} from "./EditModePage";
import { appsSchema } from '../EditFormFieldConfig/hooks/useInstanceApps';
import {PluginSchema} from "../EditFormFieldConfig/FormController";
import {ViewModePage} from "./ViewModePage";

type Props = {
    programId: string;
    record: z.infer<typeof FormattedEnrollmentDataStoreInfo> | undefined;
    apps: Array<z.infer<typeof appsSchema>>;
}

export const ENROLLMENT_PAGES = {
    OVERVIEW: 'overview',
    NEW_EVENT: 'newEvent',
    EDIT_EVENT: 'editEvent',
    ERROR: 'error',
} as const;

export const EditEnrollmentOverview = ({ programId, record, apps }: Props) => {
    const [params, setPageParams] = useSearchParams();
    const editMode: boolean = params.get('editMode') === 'true';
    const urlPage = params.get('page') ?? ENROLLMENT_PAGES.OVERVIEW;
    const navigate = useNavigate();

    const availablePlugins = useMemo(() => {
        const filteredApps = apps.filter(app => app.pluginLaunchUrl);

        return filteredApps.map(app => ({
            id: app.key,
            displayName: app.name,
            description: app.description,
            pluginLaunchUrl: app.pluginLaunchUrl,
            version: app.version,
            type: 'PLUGIN' as const,
        })) as Array<z.infer<typeof PluginSchema>>;
    }, [apps])

    const page = useMemo(() => {
        if (urlPage === ENROLLMENT_PAGES.NEW_EVENT) {
            return ENROLLMENT_PAGES.NEW_EVENT;
        }
        if (urlPage === ENROLLMENT_PAGES.EDIT_EVENT) {
            return ENROLLMENT_PAGES.EDIT_EVENT;
        }
        if (urlPage === ENROLLMENT_PAGES.OVERVIEW) {
            return ENROLLMENT_PAGES.OVERVIEW;
        }
        return ENROLLMENT_PAGES.ERROR;
    }, [urlPage, params]);

    const updatePage = (page: string) => {
        setPageParams({ page });
    }

    const initEditMode = () => {
        setPageParams({ page, editMode: 'true' });
    }

    const goBackToTableView = () => {
        navigate('/enrollmentOverview');
    }

    if (page === ENROLLMENT_PAGES.ERROR) {
        return (
            <div className={'w-3/4 mt-4 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/3 px-4 py-6'}>
                <p>{i18n.t('There seems to be an unexpected error. Please go back and try again.')}</p>
            </div>
        )
    }

    return (
        <div className={'px-4 space-y-4'}>
            {editMode ? (
                <CardContent>
                    <EditModePage
                        programId={programId}
                        record={record}
                        page={page}
                        allPlugins={availablePlugins}
                        onBack={() => setPageParams({ page })}
                    />
                </CardContent>
            ) : (
                <ViewModePage
                    goBackToTableView={goBackToTableView}
                    updatePage={updatePage}
                    initEditMode={initEditMode}
                    record={record}
                    allPlugins={availablePlugins}
                    page={page}
                />
            )}
        </div>
    )
}
