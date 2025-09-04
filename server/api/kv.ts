// server/api/kv.ts

export default defineEventHandler(async (event) => {
  const kv = useKV()
  if (event.method === 'GET') {
    // 读取数据
    const { key } = getQuery(event)
    if (!key || typeof key !== 'string') {
      throw createError({ statusCode: 400, message: 'Invalid key' })
    }
    return await kv.get(key)
  }
  else if (event.method === 'POST') {
    // 写入数据
    const { key, value } = await readBody(event)
    if (!key || typeof key !== 'string' || value === undefined) {
      throw createError({ statusCode: 400, message: 'Invalid key or value' })
    }
    await kv.set(key, value)
    return { success: true }
  }
  else if (event.method === 'DELETE') {
    // 删除数据
    const { key } = await readBody(event)
    if (!key || typeof key !== 'string') {
      throw createError({ statusCode: 400, message: 'Invalid key' })
    }
    await kv.delete(key)
    return { success: true }
  }

  throw createError({ statusCode: 405, message: 'Method not allowed' })
})