import React, { FC, useMemo } from "react";
import { Container, Flex, IconButton, Separator } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "./components/themeSwitch";
import { DashboardIcon, GearIcon, InfoCircledIcon, QuestionMarkCircledIcon, UploadIcon } from "@radix-ui/react-icons";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";

type Route = {
  order: number
  path: string
  title: string
  icon?: React.ReactNode
}

const routes: Route[] = [
  { order: 1, path: "/", title: "Dasboard", icon: <DashboardIcon /> },
  { order: 5, path: "/about", title: "About", icon: <InfoCircledIcon /> },
  { order: 4, path: "/instructions", title: "FAQ", icon: <QuestionMarkCircledIcon /> },
  { order: 2, path: "/loader", title: "Uploader", icon: <UploadIcon /> },
  { order: 3, path: "/settings", title: "Settings", icon: <GearIcon /> }

];
const Navbar: FC = () => {

  const credentials = useLiveQuery(()=>db.credentials.toArray(),[])||[]

  const validRoutes = useMemo(()=>{
    if (!credentials.length) return routes.filter(r=>r.title!== 'Uploader')
    if (credentials[0].is_valid){
      return routes
    } else {
      return routes.filter(r=>r.title!== 'Uploader')
    }
  },[credentials])


  return (
    <Container py="3" >
        <Flex width="100%" justify="between" align="center">
          <Flex gap="3" justify="center" align="center">
            {validRoutes.sort((a, b) => a.order - b.order).map(({ path, title, icon }) => (
              <NavLink
                className={({ isActive }) =>
                  [
                    isActive
                      ? "bg-slate-700 text-slate-200 dark:bg-slate-300 dark:text-slate-700"
                      : "hover:bg-slate-200 text-slate-700 dark:text-slate-300  dark:hover:bg-slate-700  ",
                    "text-xs md:text-sm 2xl:text-md py-1.5 px-3 rounded-md transition-all duration-300 font-semibold "
                  ].join(" ")
                }
                key={path}
                to={path}>
                <Flex justify="center" align={"center"} gap={"2"}>
                  {icon && icon}
                  {title}
                </Flex>
              </NavLink>
            ))}
          </Flex>
          <Flex justify="center" align="center" gap="3">
            <IconButton variant="ghost" radius="full" mr="2">
              <GearIcon width="18" height="18" />
            </IconButton>
            <ThemeSwitch />
          </Flex>
        </Flex>
        <Separator size="4" mt="3" />
    </Container>
  );
};

export default Navbar;
