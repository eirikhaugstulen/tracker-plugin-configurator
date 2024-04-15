import React from "react";
import {Sheet, SheetContent, SheetTrigger} from "../ui/sheet";
import {Button} from "../ui/button";
import {HomeIcon, Package2Icon, PanelLeftIcon} from "lucide-react";

export const MobileNavigation = () => {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="sm:hidden" size="icon" variant="outline">
                        <PanelLeftIcon className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-xs" side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <a
                            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                            href="#"
                        >
                            <Package2Icon className="h-5 w-5 transition-all group-hover:scale-110" />
                            <span className="sr-only">Acme Inc</span>
                        </a>
                        <a className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" href="#">
                            <HomeIcon className="h-5 w-5" />
                            Dashboard
                        </a>
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    )
}
