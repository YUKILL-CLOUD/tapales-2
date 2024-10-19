// import { NextApiRequest, NextApiResponse } from 'next';
// import { clerkClient } from '@clerk/nextjs/server';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Check if the request method is POST
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { userId, role } = req.body;

//   // Validate request body
//   if (!userId || !role) {
//     return res.status(400).json({ error: 'Missing userId or role' });
//   }

//   try {
//     // Update the user's public metadata with the new role
//     await clerkClient.users.updateUserMetadata(userId, {
//       publicMetadata: {
//         role, // Use the role passed in the request body
//       },
//     });

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error('Error updating user role:', error);
//     return res.status(500).json({ error: 'Failed to update user role' });
//   }
// }