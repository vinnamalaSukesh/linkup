import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { User } from '@/models/user' // Ensure correct import

export async function POST(req: Request) {
    console.log("in webhook user")
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env file')
    }
    const data = await req.json()
    console.log(data)
    const wh = new Webhook(WEBHOOK_SECRET)

    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response(JSON.stringify({ error: 'Missing Svix headers' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error: Could not verify webhook:', err)
        return new Response(JSON.stringify({ error: 'Verification error' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const eventType = evt.type

    if (eventType === 'user.created') {
        const { id: clerkUserId, username } = evt.data

        try {
            const newUser = await new User({
                clerkId: clerkUserId,
                uname: username
            }).save();

            return new Response(JSON.stringify({ message: 'User saved successfully',user : newUser }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (err) {
            console.error('Error saving user:', err)
            return new Response(JSON.stringify({ error: 'User not created' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            })
        }
    }

    console.log(`Received webhook with ID ${evt.data.id} and event type ${eventType}`)
    console.log('Webhook payload:', body)

    return new Response(JSON.stringify({ message: 'Webhook received' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}
