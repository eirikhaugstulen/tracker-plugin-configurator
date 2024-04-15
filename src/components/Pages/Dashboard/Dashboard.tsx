import React from "react";
import i18n from '@dhis2/d2-i18n';
import {ArrowRightIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";

export const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className={'w-3/4 mt-4 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/3 px-4 py-6'}>
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{i18n.t('Dashboard')}</h1>
                <p className="text-gray-500 mt-1 dark:text-gray-400">
                    {i18n.t('Let\'s get started with configuring and customizing your Capture App experience.')}
                </p>
            </div>

            <div className={'flex flex-col gap-2'}>
                <div className="flex items-center space-x-2">
                    <ArrowRightIcon className="w-4 h-4 flex-shrink-0 text-gray-500"/>
                    <button
                        className="font-medium text-gray-900 underline hover:text-gray-700 dark:text-gray-50 dark:hover:underline"
                        onClick={() => navigate("/formField")}
                    >
                        {i18n.t('Form field plugins')}
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <ArrowRightIcon className="w-4 h-4 flex-shrink-0 text-gray-500"/>
                    <button
                        className="font-medium text-gray-900 underline hover:text-gray-700 dark:text-gray-50 dark:hover:underline"
                        onClick={() => navigate("/enrollmentOverview")}
                    >
                        {i18n.t('Enrollment overview plugins')}
                    </button>
                </div>
            </div>
        </div>
    )
}
