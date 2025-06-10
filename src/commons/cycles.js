import { supabase } from '@supabase/supabase-js'

async function testCycleConnection() {
  const { data, error } = await supabase.from('cycles').select('*')

  if (error) {
    console.error('Error al conectar con Supabase:', error.message)
  } else {
    console.log('Conexión exitosa. Datos:', data)
  }
}

const createCycle = async (req, res) => {
  /*  */
}

export { testCycleConnection }
