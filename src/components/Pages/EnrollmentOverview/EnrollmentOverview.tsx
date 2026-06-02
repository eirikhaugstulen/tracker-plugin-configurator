import React from "react";
import i18n from "@dhis2/d2-i18n";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "../../ui/card"
import { AddEnrollmentPageConfig } from "./AddEnrollmentPageConfig";
import { DataTableHeader, EnrollmentDataTable } from "./DataTable";
import { Table } from "../../ui/table";
import { ExportDropdown } from "../../../components/ExportDropdown";
import { useEnrollmentDataStoreInfo } from "./hooks/useEnrollmentDataStoreInfo";

export const EnrollmentOverview = () => {
  const { records, isLoading, isError } = useEnrollmentDataStoreInfo();
  const hasRecords = !isLoading && !isError && records && records.length > 0;

  return (
    <main className="grid min-w-0 flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
      <div className="flex min-w-0 w-full">
        <div className="ml-auto flex items-center gap-2">
          <ExportDropdown />
          <AddEnrollmentPageConfig />
        </div>
      </div>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>{i18n.t('Enrollment Plugins')}</CardTitle>
          <CardDescription>{i18n.t('Manage your enrollment page configurations')}</CardDescription>
        </CardHeader>
        <CardContent className="min-w-0">
          <Table className={`${hasRecords ? 'min-w-[720px]' : ''} rounded-md border`}>
            <DataTableHeader />
            <EnrollmentDataTable />
          </Table>
        </CardContent>
        <CardFooter>

        </CardFooter>
      </Card>
    </main>
  )
}
