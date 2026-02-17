import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
        return Response.json({ error: "Missing file" }, { status: 400 });
    }

    const mediaId = randomUUID();
    const key = `${mediaId}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const anyStorage = storage as any;
    if (typeof anyStorage.setItemRaw === "function") {
        await anyStorage.setItemRaw(key, bytes);
    } else {
        await storage.setItem(key, Buffer.from(bytes).toString("base64"));
    }

    await prisma.media.create({
        data: {
            id: mediaId,
            fileId: key,
        },
    });

    return Response.json({ id: mediaId, fileId: key });
}
