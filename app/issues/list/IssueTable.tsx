import NextLink from "next/link";
import Link from "@/app/components/Link";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { IssueStatusBadge } from "@/app/components";
import { Table } from "@radix-ui/themes";
import { Issue, Status } from "@/app/generated/prisma/client";

interface Props {
    searchParams: { status?: Status; orderBy?: keyof Issue; page: string };
    issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
    const columns = [
        { label: "Issue", value: "title" as keyof Issue },
        { label: "Status", value: "status" as keyof Issue, className: "hidden md:table-cell" },
        { label: "Created", value: "createdAt" as keyof Issue, className: "hidden md:table-cell" },
    ];

    // VALIDATION STATUS
    const prismaStatuses = Object.values(Status);
    const statusFilter =
        searchParams.status && prismaStatuses.includes(searchParams.status)
            ? searchParams.status
            : undefined;

    // VALIDATION ORDERBY
    const validOrderByKeys: (keyof Issue)[] = [
        "id", "title", "description", "status", "createdAt", "updatedAt"
    ];

    const orderBy: keyof Issue =
        searchParams.orderBy && validOrderByKeys.includes(searchParams.orderBy)
            ? searchParams.orderBy
            : "createdAt";

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    {columns.map((column) => (
                        <Table.ColumnHeaderCell
                            key={column.value}
                            className={column.className}
                        >
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

                            {column.value === orderBy && (
                                <ArrowUpIcon className="inline ml-1" />
                            )}
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
    );
};

export default IssueTable;
