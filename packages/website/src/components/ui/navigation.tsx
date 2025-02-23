import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { lazy, Suspense } from "react";
import { useEffect, useState } from "react";
import { NavLink as Link } from "react-router-dom";
import { NavigationLink } from "./navigationLinks";
import logo from "@/assets/aeri_logo.svg";

const icons = {
    Github: lazy(() => import("react-icons/fa").then((module) => ({ default: module.FaGithub } as const))),
    Discord: lazy(() => import("react-icons/fa").then((module) => ({ default: module.FaDiscord } as const))),
    HamburgerMenu: lazy(() => import("react-icons/gi").then((module) => ({ default: module.GiHamburgerMenu } as const))),
}

export default function Navigation() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    function toggleSheet() {
        setIsSheetOpen(!isSheetOpen);
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 75) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return (
        <>
            <header className={`sticky top-0 flex w-full h-24 items-center z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>

                {/* Navigation */}
                <div className="border-csecondary-light min-h-max mx-4 lg:mx-6 xl:mx-8 2xl:mx-auto max-w-7xl flex w-full items-center border-2 rounded-lg p-4 my-8 bg-cbackground-light">
                    <Link to="/" className="mr-6 flex items-center" prefetch="none">
                        <Suspense fallback={<div>Loading...</div>}>
                            <LogoIcon />
                        </Suspense>
                        <span className="sr-only">Aeri Logo</span>
                    </Link>

                    {/* Left Side */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        <NavigationLink href="/" children="Home" />
                        <NavigationLink href="/" children="Commands" />

                        <Link
                            to="https://github.com/ehiraa/aeri"
                            className="hover:bg-csecondary-light/40 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-2xl font-medium shadow text-ctext-light bg-csecondary-light"
                            prefetch="none"
                            target="_blank"
                        >
                            <Suspense fallback={<div>Loading...</div>}>
                                <icons.Github/>
                            </Suspense>
                        </Link>
                        <Link
                            to="#"
                            className="hover:bg-csecondary-light/40 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-2xl font-medium shadow text-ctext-light bg-csecondary-light"
                            prefetch="none"
                            target="_blank"
                        >
                            <Suspense fallback={<div>Loading...</div>}>
                                <icons.Discord/>
                            </Suspense>
                        </Link>
                    </nav>

                    {/* Right Side */}
                    <div className="ml-auto flex items-center space-x-4">
                        <Link
                            to="#"
                            className="text-black hover:bg-cprimary-light/40 inline-flex h-9 items-center justify-center rounded-md bg-cprimary-light px-4 py-2 text-sm font-medium shadow"
                            prefetch="none"
                        >
                            Sign in
                        </Link>

                        {/* Burger Menu toggle */}
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="lg:hidden bg-csecondary-light border-transparent">
                                    
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <icons.HamburgerMenu className="h-6 w-6 text-black" />
                                    </Suspense>
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full">

                                <div className="grid gap-4 text-2xl font-bold">
                                    <div className="flex flex-col space-y-4 pl-6 pb-4">
                                        <h1 className="text-cprimary-light">Main Page</h1>
                                        <NavigationLink href="/" children="Home" onClick={toggleSheet} />
                                        <NavigationLink href="/" children="Commands" onClick={toggleSheet} />
                                    </div>
                                    
                                    <div className="flex flex-col space-y-4 pl-6 pb-4">
                                        <h1 className="text-cprimary-light">Support</h1>
                                        <NavigationLink href="/" children="Server" onClick={toggleSheet} />
                                        <NavigationLink href="/" children="Guides" onClick={toggleSheet} />
                                    </div>

                                    <div className="flex flex-col space-y-4 pl-6 pb-4">
                                        <h1 className="text-cprimary-light">External</h1>
                                        <NavigationLink href="https://github.com/ehiraa/aeri" children="Github" onClick={toggleSheet} />
                                        <NavigationLink href="/" children="Discord" onClick={toggleSheet} />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
}

function LogoIcon(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
            <image href={logo} width="32" height="32" />
        </svg>
    )
}