'use client'

import { Select } from '@radix-ui/themes';
import React from 'react';
import {Status} from "@/app/generated/prisma/enums";
import {useRouter, useSearchParams} from "next/navigation";

const statuses: {label: string; value: Status | "all"}[] = [
    {label: 'All', value: 'all'},
    {label: 'Open', value: 'OPEN'},
    {label: 'In progress', value: 'IN_PROGRESS'},
    {label: 'Closed', value: 'CLOSED'},
];

const IssueStatusFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    return (
        <Select.Root defaultValue={searchParams.get('status') || 'all'} onValueChange={(status) => {
            const query = status === "all" ? "" : `?status=${status}`;
            router.push('/issues/list' + query);
        }}>
            <Select.Trigger placeholder='Sort by status...'/>
            <Select.Content>
                {statuses.map((status) => (
                    <Select.Item key={status.value} value={status.value}>
                        {status.label}
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
};

export default IssueStatusFilter;