import React from "react";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";

export default function PopoverInfo({btnContent,title,description}) {
  return (
    <Popover placement="bottom" showArrow={true} classNames={{
      base: [  
        // arrow color
        "border-default-200 bg-gray-100"
      ],
      content: [
        "py-3 px-4 border border-default-200 rounded-lg",
        "bg-gradient-to-r from-white to-trasparent",
        "dark:from-default-100 dark:to-default-50",
      ],
    }}>
      <PopoverTrigger>
        <Button className="text-blue-50 bg-blue-950 rounded-full mx-1 px-1  w-3 h-4 text-xs">{btnContent}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">{title}</div>
          <div className="text-tiny mx-3">{description}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
