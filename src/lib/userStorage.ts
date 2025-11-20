// lib/userStorage.ts
export const getUserKey = (key: string): string => {
  const usuarioActivo = localStorage.getItem('usuarioActivo')
  if (!usuarioActivo) {
    console.warn('⚠️ No hay usuario activo, usando key global')
    return key
  }
  
  try {
    const user = JSON.parse(usuarioActivo)
    const userKey = `${user.username}_${key}`
    console.log(`🔑 Key generada: ${userKey}`)
    return userKey
  } catch (error) {
    console.error('❌ Error parseando usuario activo:', error)
    return key
  }
}

export const saveUserData = (key: string, value: string) => {
  const userKey = getUserKey(key)
  localStorage.setItem(userKey, value)
  console.log(`💾 Guardado: ${userKey} = ${value.substring(0, 50)}...`)
}

export const getUserData = (key: string): string | null => {
  const userKey = getUserKey(key)
  const data = localStorage.getItem(userKey)
  console.log(`📖 Leyendo: ${userKey} = ${data ? 'encontrado' : 'no existe'}`)
  return data
}

export const removeUserData = (key: string) => {
  const userKey = getUserKey(key)
  localStorage.removeItem(userKey)
  console.log(`🗑️ Eliminado: ${userKey}`)
}

export const getCurrentUser = () => {
  const usuarioActivo = localStorage.getItem('usuarioActivo')
  if (!usuarioActivo) return null
  
  try {
    return JSON.parse(usuarioActivo)
  } catch (error) {
    console.error('❌ Error parseando usuario:', error)
    return null
  }
}
