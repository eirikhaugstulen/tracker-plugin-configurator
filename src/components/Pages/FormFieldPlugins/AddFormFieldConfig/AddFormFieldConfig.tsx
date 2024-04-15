import React from "react";
import i18n from '@dhis2/d2-i18n';
import {z} from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../../ui/dialog";
import {Button} from "../../../ui/button";
import {Loader2, PlusCircleIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "../../../ui/form";
import {TrackedEntityTypeSelector} from "./TrackedEntityTypeSelector";
import {ProgramSelector} from "./ProgramSelector";
import {ProgramStageSelector} from "./ProgramStageSelector";
import {useNavigate} from "react-router-dom";

const formSchema = z.object({
    trackedEntityType: z.string().min(1, { message: i18n.t('Tracked entity type is required') }),
    program: z.string().optional(),
    programStage: z.string().optional(),
});

export const AddFormFieldConfig = () => {
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            trackedEntityType: '',
            program: '',
            programStage: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>, ) => {
        const { trackedEntityType, program } = values;

        if (program) {
            navigate(`/formField/${program}`);
        } else {
            navigate(`/formField/${trackedEntityType}`);
        }
    }

    return (
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
                        {i18n.t('Let\'s start by selecting the context you want to customize.')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <TrackedEntityTypeSelector />

                        <ProgramSelector />

                        <ProgramStageSelector />

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
    )
}
