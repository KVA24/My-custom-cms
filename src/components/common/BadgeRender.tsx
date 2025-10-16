import {Badge} from "@/components/ui/badge.tsx";
import React from "react";
import {CheckIcon, XIcon} from "lucide-react";

interface BadgeRenderProps {
  status: string | boolean | undefined
}

const BadgeRender = ({status}: BadgeRenderProps) => {
  switch (status) {
    case true:
      return (
        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-950/50">
          <CheckIcon size={14} className="text-green-600 dark:text-green-500"/>
        </div>
      )
    case false:
      return (
        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/50">
          <XIcon size={14} className="text-red-600 dark:text-red-500"/>
        </div>
      )
    case "ACTIVE":
      return (
        <Badge variant="success" appearance="outline" className="transition-smooth">
          Active
        </Badge>
      )
    case "INACTIVE":
      return (
        <Badge variant="secondary" appearance="outline" className="transition-smooth text-foreground">
          Inactive
        </Badge>
      )
    case "DISABLED":
      return (
        <Badge variant="warning" appearance="outline" className="transition-smooth">
          Disabled
        </Badge>
      )
    case "NEW":
      return (
        <Badge variant="primary" appearance="outline" className="transition-smooth">
          New
        </Badge>
      )
    case "REJECT":
      return (
        <Badge variant="warning" appearance="outline" className="transition-smooth">
          Reject
        </Badge>
      )
    case "COMPLETED":
      return (
        <Badge variant="info" appearance="outline" className="transition-smooth">
          Completed
        </Badge>
      )
    case "DELETED":
      return (
        <Badge variant="secondary" appearance="outline" className="transition-smooth">
          Deleted
        </Badge>
      )
    default:
      return
  }
}

export default BadgeRender