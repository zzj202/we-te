// 封装 userKvAPI 调用
export const userKvAPI = () => {
  const set = async (key: string, value: any) => {
    return await $fetch('/api/kv', {
      method: 'POST',
      body: {
        key,
        value: JSON.stringify(value)
      }
    })
  }

  const get = async (key: string) => {
    const response = await $fetch('/api/kv', {
      query: { key }
    })
    return response 
  }

  const del = async (key: string) => {
    return await $fetch('/api/kv', {
      method: 'DELETE',
      body: { key }
    })
  }

  return { set, get, del }
}