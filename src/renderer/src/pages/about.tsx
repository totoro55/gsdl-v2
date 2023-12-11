import React, { FC } from "react";
import { Heading } from "@radix-ui/themes";
import PageLayout from "../components/PageLayout/pageLayout";

interface AboutPageProps {
  children?:React.ReactNode
}
const About: FC<AboutPageProps> = ({ children }: React.PropsWithChildren<AboutPageProps>) => {
  return (
    <PageLayout>
      <Heading>
        About Page
      </Heading>
      {children}
    </PageLayout>
  );
};

export default About;
