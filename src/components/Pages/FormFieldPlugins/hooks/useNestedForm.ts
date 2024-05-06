import { BaseSyntheticEvent } from "react";
import {FieldValues, SubmitHandler, useForm, UseFormProps} from "react-hook-form";

const useNestedForm = <TFieldValues extends FieldValues>(options: UseFormProps<TFieldValues>) => {
    const {
        handleSubmit: internalSubmit,
        ...rest
    } = useForm<TFieldValues>(options);

    const handleSubmit = (onSubmit: SubmitHandler<TFieldValues>) => (e: BaseSyntheticEvent<object, any, any> | undefined): Promise<void> => {
        if (e) {
            e.preventDefault();
            internalSubmit(onSubmit)(e);
            e.stopPropagation();
        }
        // @ts-ignore
        return;
    };

    return {
        handleSubmit,
        ...rest,
    };
};

export default useNestedForm;
