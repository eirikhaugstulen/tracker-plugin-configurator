import React from "react";
import i18n from '@dhis2/d2-i18n';
import {WidgetTypes} from "../../EditModePage/hooks/useDefaultValues";
import {Widgets} from "../../Widgets.constants";
import {PluginSchema} from "../../../EditFormFieldConfig/FormController";
import {z} from "zod";
import {ApiColumnSchema} from "../../../EnrollmentOverview/hooks/useEnrollmentDataStoreInfo";

type ItemDisplayProps = {
    item: z.infer<typeof ApiColumnSchema>[0]
    allPlugins: Array<z.infer<typeof PluginSchema>>;
}

export const ItemDisplay: React.FC<ItemDisplayProps> = ({ item, allPlugins }) => {
    if (item.type === WidgetTypes.COMPONENT) {
        const widgetMetadata = Widgets[item.name]
        if (!widgetMetadata) return null;
        return (
            <div
                key={item.name}
                className={'border flex justify-between items-center p-4 min-h-24 bg-gray-50 cursor-not-allowed rounded mt-2'}
            >
                {widgetMetadata.title}
            </div>
        )
    }
    if (item.type === WidgetTypes.PLUGIN) {
        const plugin = allPlugins.find(plugin => plugin.pluginLaunchUrl === item.source);
        if (!plugin) {
            return (
                <div
                    key={item.source}
                    className={'border flex justify-between items-center p-4 min-h-24 bg-gray-50 cursor-not-allowed rounded mt-2'}
                >
                    <div className={'space-y-1'}>
                        <p>{i18n.t('Unknown plugin')}</p>
                        <p className={'text-gray-600'}>{i18n.t('Locally hosted or unknown plugin.')}</p>
                    </div>
                </div>
            )
        }
        return (
            <div
                key={plugin.id}
                className={'border flex justify-between items-center p-4 min-h-24 bg-gray-50 cursor-not-allowed rounded mt-2'}
            >
                <div className={'space-y-1'}>
                    <p>{plugin.displayName}</p>
                    <p className={'text-gray-600'}>{plugin.description}</p>
                </div>
            </div>
        )
    }
    return null;
}
