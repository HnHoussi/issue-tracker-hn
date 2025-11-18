import { Table } from "@radix-ui/themes";
import prisma from "@/lib/prisma";
import { IssueStatusBadge } from "@/app/components";
import IssueActions from "@/app/issues/list/IssueActions";
import { Status } from "@/app/generated/prisma/enums";
import { Issue } from "@/app/generated/prisma/client";
import NextLink from "next/link";
import Link from "@/app/components/Link";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
    searchParams: Promise<{ status?: Status; orderBy?: keyof Issue }>;
}

const IssuesPage = async ({ searchParams }: Props) => {
    const params = await searchParams; // IMPORTANT FIX

    const columns = [
        { label: "Issue", value: "title" as keyof Issue },
        { label: "Status", value: "status" as keyof Issue, className: "hidden md:table-cell" },
        { label: "Created", value: "createdAt" as keyof Issue, className: "hidden md:table-cell" },
    ];

    // Prisma enum statuses
    const prismaStatuses = Object.values(Status);

    // Validate status
    const statusFilter: Status | undefined =
        params.status && prismaStatuses.includes(params.status as Status)
            ? (params.status as Status)
            : undefined;

    // Validate orderBy
    const validOrderByKeys = ["id", "title", "description", "status", "createdAt", "updatedAt"] as (keyof Issue)[];
    const orderBy: keyof Issue = validOrderByKeys.includes(params.orderBy!)
        ? params.orderBy!
        : "createdAt";

    const issues = await prisma.issue.findMany({
        where: statusFilter ? { status: statusFilter } : undefined,
        orderBy: { [orderBy]: "asc" },
    });

    return (
        <div>
            <IssueActions />
            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        {columns.map((column) => (
                            <Table.ColumnHeaderCell key={column.value} className={column.className}>
                                <NextLink
                                    href={{
                                        pathname: "/issues/list",
                                        query: {
                                            ...(statusFilter && { status: statusFilter }),
                                            orderBy: column.value,
                                        },
                                    }}
                                >
                                    {column.label}
                                </NextLink>

                                {column.value === orderBy && <ArrowUpIcon className="inline ml-1" />}
                            </Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {issues.map((issue) => (
                        <Table.Row key={issue.id}>
                            <Table.Cell>
                                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                                <div className="block md:hidden">
                                    <IssueStatusBadge status={issue.status} />
                                </div>
                            </Table.Cell>
                            <Table.Cell className="hidden md:table-cell">
                                <IssueStatusBadge status={issue.status} />
                            </Table.Cell>
                            <Table.Cell className="hidden md:table-cell">
                                {issue.createdAt.toDateString()}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    );
};

export const dynamic = "force-dynamic";

export default IssuesPage;
