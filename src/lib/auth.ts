import { headers } from 'next/headers'
import { verifyJWT } from './jwt'
export async function getUserFromHeader() {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    const token = authHeader.split(' ')[1]
    const payload = await verifyJWT(token)
    
    return payload // chứa { id, role }
  } catch (error) {
    return null
  }
}
