import React from "react";
import i18n from "@dhis2/d2-i18n";
import {Loader2, PlusCircleIcon} from "lucide-react";
import {Button} from "../../../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../../ui/dialog";
import {ContextSelector} from "./ContextSelector";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "../../../ui/form";

export const EnrollmentPages = {
    ENROLLMENT_OVERVIEW: 'enrollmentOverviewLayout',
    ENROLLMENT_EVENT_NEW: 'enrollmentEventNewLayout',
    ENROLLMENT_EVENT_EDIT: 'enrollmentEventEditLayout',
} as const;

const formSchema = z.object({
    program: z.string({
        required_error: i18n.t('Program is required')
    }),
    page: z.string({
        required_error: i18n.t('Page is required'),
    })
})

export const AddEnrollmentPageConfig = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {}
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="h-8 gap-1" size="sm">
                        <PlusCircleIcon className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{i18n.t('Add configuration')}</span>
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{i18n.t('Add new configuration')}</DialogTitle>
                        <DialogDescription>
                            {i18n.t('Let\'s start by selecting the program and the page you want to configure.')}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <ContextSelector form={form} />

                            <DialogFooter className={'mt-10'}>
                                <DialogTrigger
                                    asChild
                                >
                                    <Button size="sm" variant="outline" type={'button'}>
                                        Cancel
                                    </Button>
                                </DialogTrigger>
                                <Button size="sm" disabled={form.formState.isSubmitting}>
                                    Next
                                    {form.formState.isSubmitting && (<Loader2 className="ml-2 h-4 w-4 animate-spin" />)}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>


        </div>
    )
}
