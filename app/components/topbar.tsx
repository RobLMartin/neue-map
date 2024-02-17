import { Form, Link } from "@remix-run/react";
import Logo from "./logo";
import { ExitIcon } from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import DatasetSelect from "./dataset.select";

const NavBar = () => {
  return (
    <div className="border dark:border-neutral-700 sticky top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between gap-4">
        <div className="flex">
          <div className="border-r dark:border-neutral-700 w-[77px]">
            <Link
              to="/"
              className="hover:dark:bg-neutral-800 hover:bg-neutral-50 transition-colors duration-200 ease-in-out w-full h-full grid place-content-center"
            >
              <Logo height={30} width={30} />
            </Link>
          </div>
          <DatasetSelect />
        </div>

        <Form
          method="post"
          action="/logout"
          className="flex items-center border-l dark:border-neutral-700"
        >
          <Tooltip.Provider>
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <button className="p-6 tracking-wider hover:dark:bg-neutral-800 hover:bg-neutral-50 transition-colors duration-200 ease-in-out">
                  <ExitIcon height={20} width={20} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] dark:bg-neutral-800 bg-neutral-50 px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                  sideOffset={24}
                >
                  Logout
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Form>
      </div>
    </div>
  );
};

export default NavBar;
