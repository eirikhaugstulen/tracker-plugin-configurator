import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { z } from "zod"
import { PluginSchema } from "./Pages/FormFieldConfigurator/FormController/hooks/useFormFieldController"

interface Props {
  plugins: Array<z.infer<typeof PluginSchema>>
  onAddPlugin?: (plugin: z.infer<typeof PluginSchema>) => void
}

// Form schema for the local plugin URL
const LocalPluginFormSchema = z.object({
  localPluginUrl: z.string().url('Please enter a valid URL')
})

type LocalPluginFormValues = z.infer<typeof LocalPluginFormSchema>

export function PluginAdderComponent({ plugins, onAddPlugin }: Props) {
  const [open, setOpen] = useState(false)

  const form = useForm<LocalPluginFormValues>({
    resolver: zodResolver(LocalPluginFormSchema),
    defaultValues: {
      localPluginUrl: ''
    }
  })

  const handleAddLocalPlugin = (values: LocalPluginFormValues) => {
    if (onAddPlugin) {
      onAddPlugin({
        id: values.localPluginUrl,
        displayName: 'Local Plugin',
        description: 'A plugin that is hosted locally',
        pluginLaunchUrl: values.localPluginUrl,
        type: 'PLUGIN' as const,
      });
    }
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add element
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Plugin</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Add Local Plugin</h3>
            <form onSubmit={form.handleSubmit(handleAddLocalPlugin)}>
              <Label htmlFor="localPluginUrl" className="text-sm font-medium">
                Plugin Launch URL
              </Label>
              <div className="flex mt-1">
                <Input
                  id="localPluginUrl"
                  placeholder="Enter local plugin URL"
                  {...form.register('localPluginUrl')}
                  className="flex-grow"
                />
                <Button
                  type="submit"
                  className="ml-2"
                  disabled={!form.formState.isValid}
                >
                  Add
                </Button>
              </div>
              {form.formState.errors.localPluginUrl && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.localPluginUrl.message}
                </p>
              )}
            </form>
          </div>
          <div className="space-y-4">
            {plugins.map((plugin) => (
              <div key={plugin.id} className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">{plugin.displayName}</h3>
                <p className="text-sm text-gray-500">{plugin.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-400">v{plugin.version}</span>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (onAddPlugin) {
                        onAddPlugin(plugin)
                      }
                      setOpen(false)
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}