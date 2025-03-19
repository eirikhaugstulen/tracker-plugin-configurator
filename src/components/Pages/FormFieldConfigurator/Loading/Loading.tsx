import {Card, CardContent, CardHeader, CardTitle} from "../../../ui/card";
import {Skeleton} from "../../../ui/skeleton";
import {Separator} from "../../../ui/separator";
import React from "react";

export const Loading = () => {
    return (
        <div className={'flex gap-2 px-4 mt-12'}>
            <Card className={'w-1/2'}>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className={'w-1/3 h-8'}/>
                    </CardTitle>
                </CardHeader>
                <CardContent className={'flex flex-col gap-4'}>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                    <Separator/>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                    <Separator/>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                </CardContent>
            </Card>

            <Card className={'w-1/2 self-start'}>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className={'w-1/3 h-8'}/>
                    </CardTitle>
                </CardHeader>
                <CardContent className={'flex flex-col gap-4'}>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                    <Separator/>
                    <Skeleton className={'w-full h-8'}/>
                    <Skeleton className={'w-full h-8'}/>
                </CardContent>
            </Card>
        </div>
    )
}
