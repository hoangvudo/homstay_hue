import { SignJWT, jwtVerify } from 'jose'
// Trong thực tế, chuỗi secret này NÊN được lấy từ biến môi trường
const secretKey = process.env.JWT_SECRET || 'super-secret-homestay-key'
const key = new TextEncoder().encode(secretKey)
export async function signJWT(payload: any, expiresIn: string = '1d') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key)
}
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload
  } catch (error) {
    return null
  }
}
