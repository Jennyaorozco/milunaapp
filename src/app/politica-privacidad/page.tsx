// app/politica-privacidad/page.tsx
export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="border-b-4 border-purple-600 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🛡️ Política de Tratamiento de Datos Personales
          </h1>
          <p className="text-gray-600">
            <strong>Miluna App</strong> - Conforme a la Ley 1581 de 2012 de Colombia
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Última actualización: Noviembre 2025
          </p>
        </div>

        {/* Contenido */}
        <div className="space-y-8 text-gray-700">
          {/* 1. Identificación del Responsable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              1. Identificación del Responsable del Tratamiento
            </h2>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p><strong>Razón Social:</strong> Miluna App</p>
              <p><strong>Domicilio:</strong> Colombia</p>
              <p><strong>Correo electrónico:</strong> privacidad@miluna.app</p>
              <p><strong>Sitio web:</strong> www.miluna.app</p>
            </div>
          </section>

          {/* 2. Objeto y Alcance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              2. Objeto y Alcance
            </h2>
            <p className="leading-relaxed">
              La presente Política de Tratamiento de Datos Personales tiene como objetivo 
              dar cumplimiento a la <strong>Ley 1581 de 2012</strong> y al <strong>Decreto 1377 de 2013</strong>, 
              estableciendo los lineamientos para el tratamiento de datos personales recolectados 
              a través de la aplicación <strong>Miluna</strong>.
            </p>
          </section>

          {/* 3. Definiciones */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. Definiciones
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>Dato Personal:</strong> Cualquier información vinculada o que pueda 
                asociarse a una o varias personas naturales determinadas o determinables.
              </li>
              <li>
                <strong>Tratamiento:</strong> Cualquier operación o conjunto de operaciones 
                sobre datos personales (recolección, almacenamiento, uso, circulación, supresión).
              </li>
              <li>
                <strong>Titular:</strong> Persona natural cuyos datos personales sean objeto 
                de tratamiento.
              </li>
              <li>
                <strong>Habeas Data:</strong> Derecho fundamental que tiene toda persona de 
                conocer, actualizar y rectificar la información que se haya recogido sobre ella.
              </li>
            </ul>
          </section>

          {/* 4. Datos Recolectados */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              4. Datos Personales Recolectados
            </h2>
            <p className="mb-3">Miluna recolecta los siguientes tipos de datos:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Contenido de las conversaciones con el asistente Luna (chat)</li>
              <li>Datos de uso de la aplicación y navegación</li>
              <li>Información técnica (dirección IP, tipo de navegador, dispositivo)</li>
              <li>Datos de cuenta de usuario (si se registra)</li>
              <li>Documentos PDF subidos para análisis (próximamente)</li>
            </ul>
          </section>

          {/* 5. Finalidades del Tratamiento */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              5. Finalidades del Tratamiento
            </h2>
            <p className="mb-3">Los datos personales serán tratados para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Proporcionar servicios de asistente virtual con inteligencia artificial</li>
              <li>Procesar y responder consultas realizadas por los usuarios</li>
              <li>Mejorar la experiencia de usuario y funcionalidades de la aplicación</li>
              <li>Realizar análisis estadísticos y de uso (datos anonimizados)</li>
              <li>Enviar notificaciones relacionadas con el servicio</li>
              <li>Cumplir obligaciones legales y contractuales</li>
              <li>Análisis de documentos PDF (próximamente)</li>
            </ul>
          </section>

          {/* 6. Principios */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              6. Principios del Tratamiento de Datos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">🔒 Legalidad</h3>
                <p className="text-sm">El tratamiento se realiza conforme a la ley colombiana.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">🎯 Finalidad</h3>
                <p className="text-sm">Los datos se recolectan con propósitos claros y legítimos.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">🌐 Transparencia</h3>
                <p className="text-sm">Garantizamos el acceso a información sobre tus datos.</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">🛡️ Seguridad</h3>
                <p className="text-sm">Implementamos medidas técnicas para proteger los datos.</p>
              </div>
            </div>
          </section>

          {/* 7. Derechos del Titular */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              7. Derechos del Titular (Habeas Data)
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
              <p className="mb-4">Como titular de datos personales, tienes derecho a:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <strong>Conocer:</strong> Solicitar información sobre tus datos almacenados
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✏️</span>
                  <div>
                    <strong>Actualizar:</strong> Modificar datos que estén incompletos o inexactos
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🔧</span>
                  <div>
                    <strong>Rectificar:</strong> Corregir datos erróneos o inexactos
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🗑️</span>
                  <div>
                    <strong>Suprimir:</strong> Solicitar eliminación de tus datos cuando sea procedente
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🚫</span>
                  <div>
                    <strong>Revocar:</strong> Retirar la autorización para el tratamiento de datos
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* 8. Cómo Ejercer Derechos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              8. ¿Cómo Ejercer tus Derechos?
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
              <p className="mb-4">
                Para ejercer cualquiera de tus derechos, puedes contactarnos mediante:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>Correo electrónico:</strong>{' '}
                  <a href="mailto:privacidad@miluna.app" className="text-blue-600 hover:underline">
                    privacidad@miluna.app
                  </a>
                </li>
                <li>
                  <strong>Asunto:</strong> "Solicitud Habeas Data - [Tu Nombre]"
                </li>
                <li>
                  <strong>Tiempo de respuesta:</strong> Máximo 15 días hábiles
                </li>
              </ul>
            </div>
          </section>

          {/* 9. Seguridad */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              9. Medidas de Seguridad
            </h2>
            <p className="leading-relaxed">
              Miluna implementa medidas de seguridad técnicas, humanas y administrativas 
              para proteger tus datos personales contra pérdida, mal uso, acceso no autorizado, 
              divulgación, alteración o destrucción, incluyendo:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Cifrado de datos en tránsito (HTTPS/SSL)</li>
              <li>Acceso restringido a datos personales</li>
              <li>Almacenamiento seguro en servidores protegidos</li>
              <li>Monitoreo continuo de seguridad</li>
            </ul>
          </section>

          {/* 10. Compartir Datos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              10. Compartir Datos con Terceros
            </h2>
            <p className="leading-relaxed">
              Miluna utiliza servicios de terceros para el funcionamiento de la aplicación:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li><strong>Google Gemini AI:</strong> Para procesamiento de consultas del chatbot</li>
              <li><strong>Proveedores de hosting:</strong> Para almacenamiento de datos</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              Estos terceros están obligados contractualmente a proteger tus datos conforme 
              a la legislación aplicable.
            </p>
          </section>

          {/* 11. Retención */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              11. Tiempo de Retención de Datos
            </h2>
            <p className="leading-relaxed">
              Los datos personales se conservarán mientras sean necesarios para las finalidades 
              establecidas, o hasta que el titular solicite su supresión, siempre que no exista 
              una obligación legal de conservarlos.
            </p>
          </section>

          {/* 12. Cambios */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              12. Modificaciones a esta Política
            </h2>
            <p className="leading-relaxed">
              Miluna se reserva el derecho de modificar esta política en cualquier momento. 
              Los cambios se publicarán en esta página con la fecha de actualización correspondiente.
            </p>
          </section>

          {/* 13. Contacto */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              13. Contacto
            </h2>
            <div className="bg-purple-100 border-2 border-purple-600 p-6 rounded-lg">
              <p className="mb-2">
                Para cualquier consulta sobre esta política o el tratamiento de tus datos:
              </p>
              <p className="font-bold text-lg">
                📧 privacidad@miluna.app
              </p>
            </div>
          </section>

          {/* Autoridad */}
          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              🏛️ Autoridad de Control
            </h2>
            <p>
              <strong>Superintendencia de Industria y Comercio (SIC)</strong>
              <br />
              <a 
                href="https://www.sic.gov.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                www.sic.gov.co
              </a>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t-2 border-gray-200 text-center text-sm text-gray-500">
          <p>© 2025 Miluna App - Todos los derechos reservados</p>
          <p>Cumplimiento Ley 1581 de 2012 de Protección de Datos Personales - Colombia</p>
        </div>
      </div>
    </div>
  );
}
