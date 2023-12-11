import React, { FC } from "react";
import PageLayout from "./components/PageLayout/pageLayout";
import Navbar from "./components/Navbar/navbar";
import { Outlet } from "react-router-dom";

interface DashboardPageProps {
  children?:React.ReactNode
}
const App:FC<DashboardPageProps> = () => {
  return (
    <PageLayout>
      <Navbar />
      <Outlet />
    </PageLayout>
  );
};

export default App;
