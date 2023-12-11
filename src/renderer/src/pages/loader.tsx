import React, { FC } from "react";
import PageLayout from "../components/PageLayout/pageLayout";
import UploaderApp from "../components/UploaderApp/uploaderApp";

interface PageProps {
  children?:React.ReactNode
}
const Loader: FC<PageProps> = () => {
  return (
    <PageLayout>
      <UploaderApp />
    </PageLayout>
  );
};

export default Loader;
