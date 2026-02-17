import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ mediaId: string }> },
) {
    const { mediaId } = await params;

    const media = await prisma.media.findUnique({
        where: { id: mediaId },
    });

    if (!media) {
        return new Response("Not found", { status: 404 });
    }

    const anyStorage = storage as any;
    let body: Uint8Array | null = null;

    if (typeof anyStorage.getItemRaw === "function") {
        body = await anyStorage.getItemRaw(media.fileId);
    } else {
        const b64 = (await storage.getItem(media.fileId)) as string | null;
        if (b64) body = Uint8Array.from(Buffer.from(b64, "base64"));
    }

    if (!body) {
        return new Response("Not found", { status: 404 });
    }

    const buffer = Buffer.from(body);

    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/octet-stream",
        },
    });
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ mediaId: string }> },
) {
    const { mediaId } = await params;

    const media = await prisma.media.findUnique({
        where: { id: mediaId },
    });

    if (!media) {
        return new Response("Not found", { status: 404 });
    }

    await storage.removeItem(media.fileId);
    await prisma.media.delete({
        where: { id: mediaId },
    });

    return new Response(null, { status: 204 });
}
