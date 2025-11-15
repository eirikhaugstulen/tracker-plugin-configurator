import React, { useMemo } from "react";
import i18n from "@dhis2/d2-i18n";
import { CardContent, CardHeader } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { ENROLLMENT_PAGES } from "../EditEnrollmentOverview";
import { z } from "zod";
import { FormattedEnrollmentDataStoreInfo } from "../../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";
import { WidgetTypes } from "../EditModePage/hooks/useDefaultValues";
import { PluginSchema } from "../../FormFieldConfigurator/FormController";
import { ItemDisplay } from "./ItemDisplay";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../../../ui/empty";
import { LayoutTemplate } from "lucide-react";

type Props = {
    goBackToTableView: () => void;
    updatePage: (page: string) => void;
    record: z.infer<typeof FormattedEnrollmentDataStoreInfo> | undefined;
    initEditMode: () => void;
    allPlugins: Array<z.infer<typeof PluginSchema>>;
    page: 'overview' | 'newEvent' | 'editEvent';
}

export const ViewModePage = (
    {
        goBackToTableView,
        updatePage,
        initEditMode,
        record,
        allPlugins,
        page,
    }: Props
) => {
    const existingPageData = useMemo(() => {
        if (record) {
            return record[page]?.data;
        }
        return undefined;
    }, [record, page]);

    return (
        <>
            <CardHeader className={'flex flex-row justify-between'}>
                <div>
                    <Button
                        size={'sm'}
                        onClick={goBackToTableView}
                        variant={'outline'}
                    >
                        {i18n.t('Back')}
                    </Button>
                </div>
                <div>
                    <Button
                        className={'rounded-r-none'}
                        size={'sm'}
                        variant={page === ENROLLMENT_PAGES.OVERVIEW ? 'default' : 'outline'}
                        onClick={() => updatePage(ENROLLMENT_PAGES.OVERVIEW)}
                    >
                        {i18n.t('Overview')}
                    </Button>
                    <Button
                        className={'rounded-none border-x-0'}
                        size={'sm'}
                        variant={page === ENROLLMENT_PAGES.NEW_EVENT ? 'default' : 'outline'}
                        onClick={() => updatePage(ENROLLMENT_PAGES.NEW_EVENT)}
                    >
                        {i18n.t('New event')}
                    </Button>
                    <Button
                        className={'rounded-l-none'}
                        size={'sm'}
                        variant={page === ENROLLMENT_PAGES.EDIT_EVENT ? 'default' : 'outline'}
                        onClick={() => updatePage(ENROLLMENT_PAGES.EDIT_EVENT)}
                    >
                        {i18n.t('Edit event')}
                    </Button>
                </div>

                <div>
                    <Button
                        size={'sm'}
                        onClick={initEditMode}
                        variant={'outline'}
                    >
                        {i18n.t('Edit')}
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {existingPageData ? (
                    <div>
                        <div className={'flex gap-4 mt-4'}>
                            <div className={existingPageData.leftColumn?.length ? 'grow basis-3/4' : 'hidden'}>
                                {existingPageData.leftColumn?.map((item) => (
                                    <ItemDisplay
                                        key={item.type === WidgetTypes.COMPONENT ? item.name : item.source}
                                        item={item}
                                        allPlugins={allPlugins}
                                    />
                                ))}
                            </div>
                            <div className={existingPageData.rightColumn?.length ? 'grow basis-1/4' : 'hidden'}>
                                {existingPageData.rightColumn?.map((item) => (
                                    <ItemDisplay
                                        key={item.type === WidgetTypes.COMPONENT ? item.name : item.source}
                                        item={item}
                                        allPlugins={allPlugins}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <Empty className={'mt-8 bg-muted/30 max-w-3xl mx-auto'}>
                        <EmptyHeader>
                            <EmptyMedia variant={'icon'}>
                                <LayoutTemplate className={'size-6 text-muted-foreground/80'} />
                            </EmptyMedia>
                            <EmptyTitle>
                                {i18n.t('No custom layout yet')}
                            </EmptyTitle>
                            <EmptyDescription>
                                {i18n.t('This page still uses the default layout. Jump into edit mode to add widgets, reorder columns and create an experience that fits your workflows.')}
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button
                                onClick={initEditMode}
                                variant={'outline'}
                            >
                                {i18n.t('Start')}
                            </Button>
                        </EmptyContent>
                    </Empty>
                )}
            </CardContent>
        </>
    )
}
