import React from "react";
import i18n from '@dhis2/d2-i18n';
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../../ui/form";
import { useNavigate } from "react-router-dom";
import { ContextSelector } from "./ContextSelector";
import { useProgramsWithMetadataAccess } from "../../../../lib/hooks/useProgramsWithMetadataAccess";

const formSchema = z.object({
    contextId: z.string().min(1, { message: i18n.t('Configuration context is required') }),
    programStageId: z.string().optional(),
});

export const AddFormFieldConfig = () => {
    const navigate = useNavigate();
    const { programs } = useProgramsWithMetadataAccess();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contextId: '',
            programStageId: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>,) => {
        const { contextId, programStageId } = values;

        // Parse the contextId to extract the actual ID without the prefix
        let actualId = contextId;

        if (contextId.startsWith('tet-')) {
            actualId = contextId.substring(4); // Remove 'tet-' prefix
        } else if (contextId.startsWith('program-')) {
            actualId = contextId.substring(8); // Remove 'program-' prefix

            // Check if this is a tracker program and a program stage was selected
            if (programStageId && programs) {
                const program = programs.find(p => p.id === actualId);
                const isTrackerProgram = program?.programType === 'WITH_REGISTRATION';

                if (isTrackerProgram) {
                    actualId = programStageId;
                }
            }
        }

        // Default route for event programs, tracker programs without stage, and TETs
        navigate(`/formField/${actualId}`);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="h-8 gap-1" size="sm">
                    <PlusCircleIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{i18n.t('Add configuration')}</span>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{i18n.t('Add new configuration')}</DialogTitle>
                    <DialogDescription>
                        {i18n.t('Let\'s start by selecting the context you want to customize. You can configure for tracked entity types, tracker programs, or event programs.')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <ContextSelector />

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
