import React from "react";
import i18n from "@dhis2/d2-i18n";
import {
  FileIcon,
} from "lucide-react";
import { Button } from "../../ui/button"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "../../ui/card"
import {AddEnrollmentPageConfig} from "./AddEnrollmentPageConfig";
import {DataTableHeader, EnrollmentDataTable} from "./DataTable";
import {Table} from "../../ui/table";

export const EnrollmentOverview = () => {
  return (
      <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
        <div className="w-full flex">
          <div className="ml-auto flex items-center gap-2">
            <Button disabled className="h-8 gap-1" size="sm" variant="outline">
              <FileIcon className="h-3.5 w-3.5"/>
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
            </Button>
            <AddEnrollmentPageConfig />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{i18n.t('Enrollment Plugins')}</CardTitle>
            <CardDescription>{i18n.t('Manage your enrollment page configurations')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table className={'rounded-md border'}>
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
