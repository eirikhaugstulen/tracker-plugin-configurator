import React from "react";
import {Sheet, SheetClose, SheetContent, SheetTrigger} from "../ui/sheet";
import {Button} from "../ui/button";
import {BoxSelectIcon, ClipboardPenLineIcon, Package2Icon, PanelLeftIcon} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";

const navigation = [
    {
        label: "Dashboard",
        icon: Package2Icon,
        path: "/",
        activePath: ""
    },
    {
        label: "Form Field Plugin",
        icon: ClipboardPenLineIcon,
        path: "/formField",
        activePath: "formField"
    },
    {
        label: "Enrollment Overview Plugin",
        icon: BoxSelectIcon,
        path: "/enrollmentOverview",
        activePath: "enrollmentOverview"
    }
]

export const MobileNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
                        <div
                            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                        >
                            <Package2Icon className="h-5 w-5 transition-all group-hover:scale-110" />
                            <span className="sr-only">Tracker Plugin Configurator</span>
                        </div>
                        {navigation.map(({ label, icon: Icon, path, activePath }) => (
                            <SheetClose asChild key={label}>
                                <button
                                    className={`flex items-center gap-4 rounded-md px-2.5 py-2 text-left text-muted-foreground transition-colors hover:text-foreground ${location.pathname.split('/')[1] === activePath ? "bg-accent text-accent-foreground" : ""}`}
                                    onClick={() => navigate(path)}
                                >
                                    <Icon className="h-5 w-5" />
                                    {label}
                                </button>
                            </SheetClose>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    )
}
