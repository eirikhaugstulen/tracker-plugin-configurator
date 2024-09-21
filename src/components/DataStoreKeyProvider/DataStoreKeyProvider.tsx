import React, {ReactNode} from "react";
import i18n from '@dhis2/d2-i18n';
import {useDataEngine} from "@dhis2/app-runtime";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Button} from "../ui/button";
import {LoaderCircle} from "lucide-react";
import {toast} from "sonner";

const REQUIRED_KEYS = ['dataEntryForms', 'enrollmentOverviewLayout', 'enrollmentEventNewLayout', 'enrollmentEventEditLayout'];

type Props = {
    children: ReactNode,
}

export const DataStoreKeyProvider = ({ children }: Props) => {
    const dataEngine = useDataEngine();
    const queryClient = useQueryClient();

    const fetchDataStoreKey = async () => {
        const { dataStoreKey } = await dataEngine.query({ dataStoreKey: { resource: 'dataStore/capture' } });
        return dataStoreKey as string[];
    }

    const createDataStoreKeys = async () => {
        const keys = await queryClient.getQueryData(['dataStoreKeys']) as string[];
        let mutationPromises = REQUIRED_KEYS.map(key => keys?.includes(key) ? null : dataEngine.mutate({ resource: `dataStore/capture`, id: key, type: 'update', data: {} }));
        await Promise.all(mutationPromises);
    }

    const { data: keysAreValid, isLoading } = useQuery({
        queryKey: ['dataStoreKeys'],
        queryFn: fetchDataStoreKey,
        staleTime: Infinity,
        cacheTime: Infinity,
        retry: false,
        select: dataStoreKeys => dataStoreKeys ? REQUIRED_KEYS.every(key => dataStoreKeys.includes(key)) : false
    })

    const { mutate, isLoading: isSubmittingKeys } = useMutation({
        mutationFn: createDataStoreKeys,
        onSuccess: () => {
            toast.success(i18n.t('Data store keys created!'));
            queryClient.invalidateQueries(['dataStoreKeys']);
        },
        onError: (error: { message: string, details: { httpStatusCode: number } }) => {
            if (error.details.httpStatusCode === 403) {
                toast.error(i18n.t('You do not have permission to create data store keys. Make sure the user role has the "Create capture datastore configuration" authority in the users app.'));
            } else {
                toast.error(i18n.t('Failed to create data store keys{{escape}} {{error}}', {
                    error: error.message,
                    escape: ':'
                }));
            }
        }
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!keysAreValid) {
        return (
            <div className={'flex flex-col min-h-[calc(100vh_-_48px)] pt-4 bg-muted/40'}>
                <div className={'w-3/4 mt-8 flex flex-col gap-4 border mx-auto sm:mt-0 sm:w-1/4 px-4 py-6'}>
                    <h1 className={'text-lg font-bold'}>{i18n.t('Data store keys missing')}</h1>
                    <p>{i18n.t('It seems like you are missing some required data store keys.')}</p>
                    <p>{i18n.t('Do you want to create them?')}</p>
                    <Button
                        onClick={() => mutate()}
                        disabled={isSubmittingKeys}
                    >
                        {isSubmittingKeys && (
                            <LoaderCircle
                                className="h-4 w-4 mr-2 animate-spin"
                            />
                        )}
                        {i18n.t('Create keys')}
                    </Button>
                </div>
            </div>
        )
    }

    return children;
}
