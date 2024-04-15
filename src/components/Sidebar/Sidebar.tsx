import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/tooltip";
import {BoxSelectIcon, ClipboardPenLineIcon, Package2Icon} from "lucide-react";
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

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    console.log(location.pathname.split('/')[1])

    return (
        <aside className="fixed mt-[48px] inset-y-0 left-0 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <TooltipProvider>
                    {navigation.map(({label, icon: Icon, path, activePath}) => (
                        <Tooltip delayDuration={0} key={label}>
                            <TooltipTrigger asChild>
                                <button
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${location.pathname.split('/')[1] === activePath ? "bg-accent text-accent-foreground" : ""}`}
                                    onClick={() => navigate(path)}
                                >
                                    <Icon className="h-5 w-5"/>
                                    <span className="sr-only">{label}</span>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{label}</TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </nav>
        </aside>
    )
}
