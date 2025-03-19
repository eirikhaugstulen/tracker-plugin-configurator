import {PluginSettingSchema} from "../PluginDraggable/PluginDialogContent";
import {z} from "zod";
import {useState} from "react";

type Props = {
    existingPluginConfigs: Record<string, z.infer<typeof PluginSettingSchema>>
}

export const usePluginConfigurations = ({ existingPluginConfigs }: Props) => {
    const [pluginConfigurations, setPluginConfigurations] = useState<Record<string, z.infer<typeof PluginSettingSchema>>>(existingPluginConfigs);

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
