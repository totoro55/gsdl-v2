import { FC } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

const ReloadSpinner:FC= () => {
  return (
    <div className='animate-spin text-indigo-500 dark:text-indigo-300'>
      <ReloadIcon />
    </div>
  );
};

export default ReloadSpinner;
