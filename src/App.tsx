import * as React from 'react'
import './locales/index';
import './index.css';
import './tailwind.css';
import {HashRouter, Route, Routes} from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {EnrollmentOverview} from "./components/Pages/EnrollmentOverview";
import {Dashboard} from "./components/Pages/Dashboard";
import { Sidebar } from './components/Sidebar'
import {MobileNavigation} from "./components/MobileNavigation";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {FormFieldPlugins} from "./components/Pages/FormFieldPlugins";
import {Toaster} from "./components/ui/sonner";
import {EditFormFieldMetadataWrapper} from "./components/Pages/EditFormFieldConfig";
import {DataStoreKeyProvider} from "./components/DataStoreKeyProvider/DataStoreKeyProvider";
import {EditEnrollmentOverviewWrapper} from "./components/Pages/EditEnrollmentOverview/EditEnrollmentOverviewWrapper";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: 'online',
            retry: false,
        }
    }
})
const MyApp = () => {
    return (
        <span className={''}>
        <QueryClientProvider
            client={queryClient}
        >
            <HashRouter>
                <DataStoreKeyProvider>
                    <div className="flex min-h-[calc(100vh_-_48px)] w-full flex-col bg-muted/40 dark:bg-black">
                        <Sidebar/>
                        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                            <MobileNavigation />

                            <Routes>
                                <Route path="/formField" element={<FormFieldPlugins />}/>
                                <Route path="/formField/:formFieldId" element={<EditFormFieldMetadataWrapper />} />
                                <Route path="/enrollmentOverview" element={<EnrollmentOverview />}/>
                                <Route path="/enrollmentOverview/:contextId" element={<EditEnrollmentOverviewWrapper />}/>
                                <Route path="/" element={<Dashboard />}/>
                            </Routes>
                        </div>
                    </div>
                </DataStoreKeyProvider>
                <Toaster
                    closeButton
                />
            </HashRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        </span>
    );
}

export default MyApp
