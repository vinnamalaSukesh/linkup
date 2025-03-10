import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { User } from '@/models/user'
import { connect } from '@/models/connect'

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET
    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env file')
    }
    const data = await req.json()
    const wh = new Webhook(SIGNING_SECRET)

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

    const body = JSON.stringify(data)

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

    await connect()

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
    else if(eventType == "user.deleted"){
        const {id : clerkUserId} = evt.data
        try {
            const deletedUser = await User.findOneAndDelete({
                clerkId : clerkUserId
            })
            return new Response(JSON.stringify({ message : 'User  deleted', user : deletedUser }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        catch(err){
            console.error('Error in deleting user',err)
            return new Response(JSON.stringify({ error: 'User not deleted' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        }
    else if(eventType == "user.updated"){
        const {id : clerkUserId, username} = evt.data
        try{
            const updateUser = await User.findOneAndUpdate(
                { clerkId: clerkUserId }, { $set: { uname: username } }, { new: true })
                
        return new Response(JSON.stringify({ message : 'User not created' ,user : updateUser}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
        }
        catch(error){
        return new Response(JSON.stringify({ error: `User not created ${error}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
        }
    }
    return new Response(JSON.stringify({ message: 'Webhook received but event type not match' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
    })
}
