import prisma from "@/lib/prisma";
import IssueActions from "@/app/issues/list/IssueActions";
import { Status, Issue } from "@/app/generated/prisma/client";
import Pagination from "@/app/components/Pagination";
import IssueTable from "./IssueTable";
import {Flex} from "@radix-ui/themes";
import {Metadata} from "next";

interface Props {
    searchParams: Promise<{ status?: Status; orderBy?: keyof Issue; page: string }>;
}

const IssuesPage = async ({ searchParams }: Props) => {
    const params = await searchParams;

    // Prisma enum statuses
    const prismaStatuses = Object.values(Status);

    // Validate status
    const statusFilter: Status | undefined =
        params.status && prismaStatuses.includes(params.status as Status)
            ? (params.status as Status)
            : undefined;

    // Validate orderBy
    const validOrderByKeys: (keyof Issue)[] = [
        "id",
        "title",
        "description",
        "status",
        "createdAt",
        "updatedAt"
    ];

    const orderBy: keyof Issue =
        params.orderBy && validOrderByKeys.includes(params.orderBy)
            ? params.orderBy
            : "createdAt";

    const pageSize = 10;
    const page = params.page ? parseInt(params.page) : 1;

    const [issues, issueCount] = await Promise.all([
        prisma.issue.findMany({
            where: statusFilter ? { status: statusFilter } : undefined,
            orderBy: { [orderBy]: "asc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.issue.count({
            where: statusFilter ? { status: statusFilter } : undefined,
        }),
    ]);

    return (
        <Flex direction="column" gap='4'>
            <IssueActions />

            <IssueTable
                searchParams={params}
                issues={issues}
            />

            <Pagination
                itemCount={issueCount}
                pageSize={pageSize}
                currentPage={page}
            />
        </Flex>
    );
};

export const metadata: Metadata = {
    title: "Issue Tracker : Issue List",
    description: 'View all issues',
};

export const dynamic = "force-dynamic";

export default IssuesPage;
