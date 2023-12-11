import React, { FC } from "react";
import { Heading } from "@radix-ui/themes";
import PageLayout from "../components/PageLayout/pageLayout";

interface PageProps {
  children?:React.ReactNode
}
const Instructions: FC<PageProps> = ({ children }: React.PropsWithChildren<PageProps>) => {
  return (
    <PageLayout>
      <Heading>
        Instructions Page
      </Heading>
      {children}
    </PageLayout>
  );
};

export default Instructions;
