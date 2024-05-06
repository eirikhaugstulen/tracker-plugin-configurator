import React from "react";
import {z} from "zod";
import {Draggable} from "react-beautiful-dnd";
import {NativeAttributeSchema} from "../../FormController";
import {LabelByValueType} from "../../FieldsPicker/constants";

type Props = {
    field: z.infer<typeof NativeAttributeSchema>,
    index: number,
}

export const MetadataDraggable = ({ field, index }: Props) => {
    return (
        <Draggable
            isDragDisabled
            draggableId={field.id}
            index={index}
        >
            {(provided) => (
                <div
                    key={field.id}
                    className={'w-full bg-gray-50 py-2 px-4 mt-2 flex items-center cursor-not-allowed select-none justify-between border rounded-sm'}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div>
                        <p>
                            {field.displayName}
                        </p>
                        <p className={'text-gray-500'}>
                            {LabelByValueType[field.valueType] || field.valueType}
                        </p>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
