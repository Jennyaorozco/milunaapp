import { supabase } from '../../lib/subabase'

const testUsersConnection = async () => {
  const { data, error } = await supabase.from('user').select('*')

  if (error) {
    console.error('Error al conectar con Supabase:', error.message)
  } else {
    console.log('Conexión exitosa. Datos:', data)
  }
}


const createUser = async (req, res) => {
    const { name, email, password } = req.body
    
}