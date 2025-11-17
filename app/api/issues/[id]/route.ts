import {NextRequest, NextResponse} from "next/server";
import {patchIssueSchema} from "@/app/validationSchemas";
import prisma from "@/lib/prisma";
import {getServerSession} from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function PATCH(
    request: NextRequest,
    context: {params: Promise<{ id: string }>}) {

    const {id} = await context.params
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, {status: 401})

    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);

    if (!validation.success)
        return NextResponse.json(validation.error.issues, {status: 400});

    const {assignedToUserId, title, description} = body;
    if (assignedToUserId) {
        const user = await prisma.user.findUnique({where: {id: assignedToUserId}});
        if (!user)
            return NextResponse.json({error: 'Invalid user.'}, {status: 400})
    }

    const issue = await prisma.issue.findUnique({
        where: {id: parseInt(id)}
    })

    if (!issue)
        return NextResponse.json({error: 'Invalid Issue'}, {status: 404});

    const updatedIssue = await prisma.issue.update({
        where: {id: issue.id},
        data: {
            title,
            description,
            assignedToUserId
        }
    });

    return NextResponse.json(updatedIssue);
}

export async function DELETE(
    request: NextRequest,
    context: {params: Promise<{ id: string }>}) {

    const {id} = await context.params
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, {status: 401})

    const issue = await prisma.issue.findUnique({
        where: {id: parseInt(id)}
    });

    if (!issue)
        return NextResponse.json({error: 'Invalid Issue'}, {status: 404})

    await prisma.issue.delete({
        where: {id: issue.id}
    });

    return NextResponse.json({});
}