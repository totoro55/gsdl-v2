import { FC} from "react";
import { useTheme } from "next-themes";
import { IconButton } from "@radix-ui/themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const ThemeSwitch: FC = () => {
  const { theme, setTheme } = useTheme()



  return (
      <IconButton
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        variant='ghost' radius='full' mr='2'>
        {theme === 'dark'
          ? <MoonIcon width="18" height="18" />
          : <SunIcon width="18" height="18" />
        }
      </IconButton>
  );
};

export default ThemeSwitch;
