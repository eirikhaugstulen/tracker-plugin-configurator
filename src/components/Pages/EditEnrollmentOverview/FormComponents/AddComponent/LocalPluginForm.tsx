import React from "react";
import i18n from "@dhis2/d2-i18n";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Button } from "../../../../ui/button";

const LocalPluginFormSchema = z.object({
    localPluginUrl: z.string().url('Please enter a valid URL')
});

type LocalPluginFormValues = z.infer<typeof LocalPluginFormSchema>;

interface Props {
    onSubmit: (pluginUrl: string) => void;
}

export const LocalPluginForm = ({ onSubmit }: Props) => {
    const form = useForm<LocalPluginFormValues>({
        resolver: zodResolver(LocalPluginFormSchema),
        defaultValues: {
            localPluginUrl: ''
        }
    });

    const handleSubmit = (values: LocalPluginFormValues) => {
        onSubmit(values.localPluginUrl);
        form.reset();
    };

    return (
        <div className={'border p-4 rounded mt-2 bg-white'}>
                <div className="space-y-2">
                    <Label htmlFor="localPluginUrl">
                        {i18n.t('Plugin Launch URL')}
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="localPluginUrl"
                            placeholder={i18n.t('Enter local plugin URL')}
                            {...form.register('localPluginUrl')}
                            className="flex-grow"
                        />
                        <Button 
                            type="button"
                            onClick={form.handleSubmit(handleSubmit)}
                            disabled={!form.formState.isValid}
                        >
                            {i18n.t('Add')}
                        </Button>
                    </div>
                    {form.formState.errors.localPluginUrl && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.localPluginUrl.message}
                        </p>
                    )}
                </div>
        </div>
    );
};
