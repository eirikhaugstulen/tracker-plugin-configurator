import React, { useState } from 'react'
import i18n from '@dhis2/d2-i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { FormFieldTable } from "./DataTable";
import { useFormFieldConfig } from "./hooks/useFormFieldConfig";
import { AddFormFieldConfig } from './AddFormFieldConfig';
import { ExportDialog } from "../../export-dialog";
import { Button } from "../../ui/button";
import { Download } from "lucide-react";

export const FormFieldPlugins = () => {
    const {
        records,
        rawData,
        isLoading,
        isError,
    } = useFormFieldConfig();

    const [isExportOpen, setIsExportOpen] = useState(false);

    return (
        <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
            <div className="w-full flex">
                <div className="ml-auto flex items-center gap-2">
                    {rawData && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExportOpen(true)}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                {i18n.t('Export')}
                            </Button>
                            <ExportDialog
                                data={rawData as object}
                                title={i18n.t('Export Form Field Configurations')}
                                description={i18n.t('Review your raw form field configurations before exporting.')}
                                open={isExportOpen}
                                onOpenChange={setIsExportOpen}
                            />
                        </>
                    )}
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
