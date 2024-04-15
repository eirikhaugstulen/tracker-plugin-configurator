import * as React from 'react'
import './index.css';
import './tailwind.css';
import {HashRouter, Route, Routes} from "react-router-dom";
import {EnrollmentOverview} from "./components/Pages/EnrollmentOverview";
import {Dashboard} from "./components/Pages/Dashboard";
import { Sidebar } from './components/Sidebar'
import {MobileNavigation} from "./components/MobileNavigation";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {FormFieldPlugins} from "./components/Pages/FormFieldPlugins";
import {Toaster} from "./components/ui/sonner";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: 'always',
            retry: false,
        }
    }
})
const MyApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <div className="flex min-h-[calc(100vh_-_48px)] w-full flex-col bg-muted/40">
                    <Sidebar/>
                    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                        <MobileNavigation />

                        <Routes>
                            <Route path="/formField" element={<FormFieldPlugins />}/>
                            <Route path="/formField/:formFieldId" element={<div>Form Field</div>}/>
                            <Route path="/enrollmentOverview" element={<EnrollmentOverview />}/>
                            <Route path="/" element={<Dashboard />}/>
                        </Routes>
                    </div>
                </div>
                <Toaster
                    closeButton
                />
            </HashRouter>
        </QueryClientProvider>
    );
}

export default MyApp
