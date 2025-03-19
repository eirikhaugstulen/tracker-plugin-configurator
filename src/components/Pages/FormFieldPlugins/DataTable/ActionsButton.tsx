import React, { useState } from "react";
import i18n from '@dhis2/d2-i18n';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "../../../ui/dropdown-menu";
import { Button } from "../../../ui/button";
import { Loader2, MoreHorizontalIcon } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../../ui/dialog";
import { useDeleteFormConfig } from "../hooks/useDeleteFormConfig";
import { useNavigate } from "react-router-dom";

type Props = {
    id: string;
}

export const ActionsButton = ({ id }: Props) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const navigate = useNavigate();
    const { deleteFormConfig, isSubmitting } = useDeleteFormConfig();

    const onEditClick = () => {
        navigate(`/formField/${id}`);
    }

    const handleDelete = async () => {
        await deleteFormConfig({ id });
        setDialogIsOpen(false);
    }

    return (
        <Dialog
            open={dialogIsOpen}
            onOpenChange={(open) => setDialogIsOpen(open)}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">{i18n.t('Toggle menu')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{i18n.t('Actions')}</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={onEditClick}
                    >
                        {i18n.t('Edit')}
                    </DropdownMenuItem>
                    <DialogTrigger asChild>
                        <DropdownMenuItem >
                            {i18n.t('Delete')}
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    {i18n.t('Delete')}
                </DialogHeader>
                <p>
                    {i18n.t('Are you sure you want to delete this configuration?')}
                </p>
                <DialogFooter>
                    <Button
                        variant={'ghost'}
                        type={'button'}
                        onClick={() => setDialogIsOpen(false)}
                    >
                        {i18n.t('Cancel')}
                    </Button>

                    <Button
                        variant={'destructive'}
                        onClick={handleDelete}
                        disabled={isSubmitting}
                    >
                        {i18n.t('Delete')}
                        {isSubmitting && (<Loader2 className="ml-2 h-4 w-4 animate-spin" />)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
