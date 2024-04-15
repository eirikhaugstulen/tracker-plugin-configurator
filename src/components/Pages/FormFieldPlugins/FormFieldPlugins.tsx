import React from 'react'
import i18n from '@dhis2/d2-i18n';
import {Button} from "../../ui/button";
import {FileIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {FormFieldTable} from "./DataTable";
import {useFormFieldConfig} from "./hooks/useFormFieldConfig";
import {AddFormFieldConfig} from './AddFormFieldConfig';

export const FormFieldPlugins = () => {
    const {
        records,
        isLoading,
        isError,
    } = useFormFieldConfig();

    return (
        <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
            <div className="w-full flex">
                <div className="ml-auto flex items-center gap-2">
                    <Button disabled className="h-8 gap-1" size="sm" variant="outline">
                        <FileIcon className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{i18n.t('Export')}</span>
                    </Button>
                    <AddFormFieldConfig />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{i18n.t('Form Field Plugins')}</CardTitle>
                    <CardDescription>{i18n.t('Manage your form configurations')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormFieldTable
                        records={records}
                        isLoading={isLoading}
                        isError={isError}
                    />
                </CardContent>
            </Card>
        </main>
    )
}
