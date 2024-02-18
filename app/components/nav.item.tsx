import * as Tooltip from "@radix-ui/react-tooltip";
import { NavLink } from "@remix-run/react";

const NavItem = ({
  icon,
  title,
  to,
}: {
  icon: any;
  title: string;
  to: string;
}) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger
          asChild
          className="flex justify-center w-full p-6 hover:dark:bg-neutral-800 hover:bg-neutral-100 transition-colors duration-200 ease-in-out"
        >
          <NavLink
            to={to}
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? "underline tracking-wider" : "tracking-wider"
            }
          >
            {icon}
          </NavLink>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] dark:bg-neutral-700 bg-neutral-100 px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
            sideOffset={24}
            side="right"
          >
            {title}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default NavItem;
