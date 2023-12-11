import React from "react";
import { Container, Flex } from "@radix-ui/themes";

interface PageLayoutProps {
  children?:React.ReactNode
}
const PageLayout:React.FC<PageLayoutProps> = ({children}:React.PropsWithChildren<PageLayoutProps>) => {



  return (
    <Container>
      <Flex width='100%' direction='column'>
        {children}
      </Flex>
    </Container>
  );
};

export default PageLayout;
