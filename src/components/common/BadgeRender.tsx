import {Badge} from "@/components/ui/badge.tsx";
import React from "react";
import {CheckIcon, XIcon} from "lucide-react";

interface BadgeRenderProps {
  status: string | boolean | undefined
}

const BadgeRender = ({status}: BadgeRenderProps) => {
  switch (status) {
    case true:
      return <CheckIcon size={20} color={"green"}/>
    case false:
      return <XIcon size={20} color={"red"}/>
    case "ACTIVE":
      return <Badge variant="success">
        Active
      </Badge>
    case "INACTIVE":
      return <Badge variant="destructive">
        InActive
      </Badge>
    case "DISABLED":
      return <Badge variant="destructive">
        Disabled
      </Badge>
    default:
      return
  }
}

export default BadgeRender