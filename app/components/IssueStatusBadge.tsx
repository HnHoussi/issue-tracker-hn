import React from 'react';
import {Status} from "@/app/generated/prisma/enums";
import {Badge} from "@radix-ui/themes";

interface Props {
    status: Status;
}

const statusMap: Record<Status, { label: string, color: 'red' | 'blue' | 'green'}> = {
    OPEN: {label: 'Open', color: 'red'},
    IN_PROGRESS: {label: 'In progress', color: 'blue'},
    CLOSED: {label: 'Closed', color: 'green'},
}

const IssueStatusBadge = ({status}: Props) => {
    return (
        <Badge color={statusMap[status].color}>
            {statusMap[status].label}
        </Badge>
    );
};

export default IssueStatusBadge;