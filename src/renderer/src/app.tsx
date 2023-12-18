import { FC} from 'react'
import PageLayout from "./components/PageLayout/pageLayout";
import Navbar from "./components/Navbar/navbar";
import { Outlet } from "react-router-dom";

const App:FC = () => {

  return (
    <PageLayout>
      <Navbar />
      <Outlet />
    </PageLayout>
  );
};

export default App;
