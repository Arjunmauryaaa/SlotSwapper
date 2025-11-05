import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function listRequests(req, res) {
    const userId = req.user.userId;
    const type = req.query.type || 'all';
    try {
        if (type === 'sent') {
            const sent = await prisma.swapRequest.findMany({ where: { requesterId: userId }, orderBy: { createdAt: 'desc' } });
            return res.json({ sent });
        }
        if (type === 'received') {
            const received = await prisma.swapRequest.findMany({ where: { responderId: userId }, orderBy: { createdAt: 'desc' } });
            return res.json({ received });
        }
        const [sent, received] = await Promise.all([
            prisma.swapRequest.findMany({ where: { requesterId: userId }, orderBy: { createdAt: 'desc' } }),
            prisma.swapRequest.findMany({ where: { responderId: userId }, orderBy: { createdAt: 'desc' } }),
        ]);
        return res.json({ sent, received });
    }
    catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
export async function createSwapRequest(req, res) {
    const requesterId = req.user.userId;
    const { mySlotId, theirSlotId } = req.body;
    if (!mySlotId || !theirSlotId)
        return res.status(400).json({ message: 'Missing fields' });
    try {
        const mySlot = await prisma.event.findUnique({ where: { id: mySlotId } });
        const theirSlot = await prisma.event.findUnique({ where: { id: theirSlotId } });
        if (!mySlot || !theirSlot)
            return res.status(404).json({ message: 'Slot not found' });
        if (mySlot.ownerId !== requesterId)
            return res.status(403).json({ message: 'Not your slot' });
        if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
            return res.status(400).json({ message: 'Both slots must be SWAPPABLE' });
        }
        if (theirSlot.ownerId === requesterId)
            return res.status(400).json({ message: 'Cannot swap with yourself' });
        const responderId = theirSlot.ownerId;
        const result = await prisma.$transaction(async (tx) => {
            const swapRequest = await tx.swapRequest.create({
                data: { mySlotId, theirSlotId, requesterId, responderId, status: 'PENDING' },
            });
            await tx.event.update({ where: { id: mySlotId }, data: { status: 'SWAP_PENDING' } });
            await tx.event.update({ where: { id: theirSlotId }, data: { status: 'SWAP_PENDING' } });
            return swapRequest;
        });
        return res.status(201).json({ request: result });
    }
    catch (e) {
        return res.status(500).json({ message: 'Server error' });
    }
}
export async function respondToSwap(req, res) {
    const responderId = req.user.userId;
    const { requestId } = req.params;
    const { action } = req.body;
    if (!['ACCEPT', 'REJECT'].includes(action))
        return res.status(400).json({ message: 'Invalid action' });
    try {
        const reqRecord = await prisma.swapRequest.findUnique({ where: { id: requestId } });
        if (!reqRecord)
            return res.status(404).json({ message: 'Request not found' });
        if (reqRecord.responderId !== responderId)
            return res.status(403).json({ message: 'Forbidden' });
        if (reqRecord.status !== 'PENDING')
            return res.status(400).json({ message: 'Request already handled' });
        const mySlot = await prisma.event.findUnique({ where: { id: reqRecord.mySlotId } });
        const theirSlot = await prisma.event.findUnique({ where: { id: reqRecord.theirSlotId } });
        if (!mySlot || !theirSlot)
            return res.status(404).json({ message: 'Slots missing' });
        if (action === 'REJECT') {
            await prisma.$transaction(async (tx) => {
                await tx.swapRequest.update({ where: { id: requestId }, data: { status: 'REJECTED' } });
                await tx.event.update({ where: { id: mySlot.id }, data: { status: 'SWAPPABLE' } });
                await tx.event.update({ where: { id: theirSlot.id }, data: { status: 'SWAPPABLE' } });
            });
            return res.json({ status: 'REJECTED' });
        }
        // ACCEPT
        await prisma.$transaction(async (tx) => {
            await tx.swapRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED' } });
            // swap owners
            await tx.event.update({ where: { id: mySlot.id }, data: { ownerId: theirSlot.ownerId, status: 'BUSY' } });
            await tx.event.update({ where: { id: theirSlot.id }, data: { ownerId: mySlot.ownerId, status: 'BUSY' } });
        });
        return res.json({ status: 'ACCEPTED' });
    }
    catch (e) {
        return res.status(500).json({ message: 'Server error' });
    }
}
