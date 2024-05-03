import {PluginSettingSchema} from "../PluginDraggable/PluginDialogContent/PluginDialogContent";
import {z} from "zod";
import {useState} from "react";

export const usePluginConfigurations = () => {
    const [pluginConfigurations, setPluginConfigurations] = useState<Record<string, z.infer<typeof PluginSettingSchema>>>({});

    const addPluginConfiguration = (id: string, configuration: z.infer<typeof PluginSettingSchema>) => {
        setPluginConfigurations((prev) => {
            return {
                ...prev,
                [id]: configuration,
            }
        })
    }

    const removePluginConfiguration = (id: string) => {
        setPluginConfigurations((prev) => {
            const copy = {...prev};
            delete copy[id];
            return copy;
        })
    }

    return {
        pluginConfigurations,
        addPluginConfiguration,
        removePluginConfiguration,
    }
}
