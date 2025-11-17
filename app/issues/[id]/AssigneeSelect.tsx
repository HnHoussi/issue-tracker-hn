'use client'

import {Select} from "@radix-ui/themes";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import Skeleton from "@/app/components/Skeleton";
import {Issue, User} from "@/app/generated/prisma/client";
import toast, {Toaster} from "react-hot-toast";

const AssigneeSelect = ({issue}: {issue: Issue}) => {
    const {data: users, error, isLoading} = useUsers();

    if (isLoading) return <Skeleton/>;
    if (error) return null;

    const assignIssue = (val: string) => {
        axios
            .patch(`/api/issues/${issue.id}`,
                {assignedToUserId: val === "unassigned" ? null : val})
            .catch(() => {
                toast.error('Changes could not be saved');
            });
    }

    return (
        <>
            <Select.Root
            defaultValue={issue.assignedToUserId || "unassigned"}
            onValueChange={assignIssue}
            >
                <Select.Trigger placeholder='Assign ...'/>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Suggestions</Select.Label>
                        <Select.Item value="unassigned">Unassigned</Select.Item>
                        {users?.map((user) => (
                            <Select.Item key={user.id} value={user.id}>{user.name}</Select.Item>
                        ))}

                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <Toaster/>
        </>
    );
};

const useUsers = () => useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () =>
        axios.get('/api/users').then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3
});

export default AssigneeSelect;