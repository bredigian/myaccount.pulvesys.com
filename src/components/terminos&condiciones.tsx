interface Props {
  hideTitle?: boolean;
}

export default function TerminosCondiciones({ hideTitle }: Props) {
  return (
    <>
      {!hideTitle && (
        <>
          <h1 className='text-2xl'>Términos y Condiciones - PulveSys</h1>
          <h6>Última actualización: 14 de abril de 2025</h6>
        </>
      )}
      <section className='terminos_condiciones flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <p>
            Bienvenido a PulveSys (https://pulvesys.com), una plataforma web
            para gestionar órdenes de pulverización, lotes, cultivos,
            tratamientos, productos y reportes agrícolas. Estos Términos y
            Condiciones (que incluyen nuestra Política de Privacidad) son un
            acuerdo vinculante entre vos, el usuario, y nosotros, Gianluca
            Bredice y Matías Rodríguez.
          </p>
          <p>
            Al registrarte, usar PulveSys o acceder a cualquier función, aceptás
            estos Términos y Condiciones en su totalidad. Si no estás de
            acuerdo, por favor no uses la plataforma.
          </p>
        </div>
        <ul id='terms' className='flex flex-col gap-2'>
          <li>
            <h4>1. ¿Qué es PulveSys y qué podés hacer?</h4>
            <p>
              PulveSys es una herramienta para profesionales agrícolas que te
              permite: Crear y gestionar órdenes de pulverización. Administrar
              lotes de campos con mapas y coordenadas. Gestionar cultivos,
              tratamientos y productos aplicados. Ver un historial de cambios
              (últimos 30 días). Exportar órdenes y mapas en formato PDF para
              compartir (ej. con el dueño del campo). Ofrecemos dos planes de
              suscripción: <strong>Plan Individual:</strong> acceso completo a
              todas las funciones mencionadas. <strong>Plan Empresa:</strong>{' '}
              todo lo del Plan Individual, más la posibilidad de administrar
              usuarios asociados (crear, modificar, eliminar), visualizar
              historial sin límite de últimos 30 días y ver sus actividades
              (órdenes, cultivos, historiales). Además, al registrarte, tenés{' '}
              <strong>30 días de prueba gratuita</strong> para usar todas las
              funciones sin costo.
            </p>
          </li>
          <li>
            <h4>2. Registro y uso de tu cuenta</h4>
            <p>
              Para usar PulveSys, debés: Contar con autorización legal.
              Registrarte con datos reales: nombre, apellido, email, número de
              teléfono, nombre de usuario y contraseña. Mantener tu contraseña
              segura. Sos responsable de todo lo que ocurra con tu cuenta. No
              proporcionar datos falsos ni intentar acceder a cuentas ajenas.
              Nos reservamos el derecho de suspender o cancelar tu cuenta si
              detectamos un uso indebido, como actividades sospechosas,
              violación de estos términos o falta de pago.
            </p>
          </li>
          <li>
            <h4>3. Suscripciones y pagos</h4>
            <p>
              PulveSys funciona con suscripciones mensuales gestionadas a través
              de <strong>Mercado Pago</strong>. Cómo funciona el pago: Los pagos
              se procesan exclusivamente en Mercado Pago. Nosotros no
              almacenamos ni accedemos a datos de pago (tarjetas, cuentas,
              etc.). Solo guardamos el estado de tu suscripción (pendiente,
              activa, pausada, cancelada) y la fecha del próximo pago para
              gestionar tu acceso. Al terminar la prueba gratuita, elegís un
              plan y pagás en Mercado Pago. Si no pagás, tu acceso puede
              limitarse o suspenderse hasta regularizar. Podés cancelar tu
              suscripción en cualquier momento desde Mercado Pago, pero no
              ofrecemos reembolsos por períodos ya pagados.
            </p>
          </li>
          <li>
            <h4>4. Uso de mapas, datos agrícolas y reportes</h4>
            <p>
              Mapas de lotes: Usamos MapBox, un servicio de mapas externo, para
              que marques los lotes con coordenadas. Vos proporcionás y
              seleccionás las coordenadas a través de MapBox, y nosotros no
              verificamos su precisión ni legalidad. Asegurate de que sean
              correctas antes de usarlas. Reportes PDF: Podés exportar órdenes y
              mapas en PDF para compartir (ej. con el dueño del campo). Los
              mapas en los PDFs incluyen tecnología de MapBox, y vos decidís con
              quién compartirlos.
            </p>
          </li>
          <li>
            <h4>5. Propiedad intelectual</h4>
            <p>
              El software, diseño, estructura, mapas generados y reportes de
              PulveSys son propiedad de Gianluca Bredice y Matías Rodríguez.
              Podés usar los reportes PDF para tu trabajo personal o
              profesional, pero no podés: Copiar, modificar, revender ni
              distribuir el sistema o sus partes sin nuestro permiso. Usar
              nuestro nombre, logo o marca (PulveSys) sin autorización escrita.
            </p>
          </li>
          <li>
            <h4>6. Limitación de responsabilidad</h4>
            <p>
              Hacemos nuestro mejor esfuerzo para que PulveSys sea confiable,
              pero: No garantizamos que la plataforma esté libre de errores,
              interrupciones o fallos técnicos. No nos hacemos responsables por:
              Errores en los datos que cargás (ej. coordenadas incorrectas,
              productos mal seleccionados). Decisiones agrícolas o económicas
              basadas en el sistema. Pérdidas, daños o sanciones legales
              derivadas del uso de PulveSys. Problemas causados por terceros
              (ej. fallos en Mercado Pago o tu conexión a internet). Usás
              PulveSys bajo tu propio riesgo, siempre respetando las leyes
              aplicables.
            </p>
          </li>
          <li>
            <h4>7. Suspensión o terminación del servicio</h4>
            <p>
              Podemos suspender o cancelar tu acceso a PulveSys si: Violás estos
              Términos y Condiciones (ej. usás el sistema para algo ilegal). No
              pagás tu suscripción. Detectamos actividad sospechosa (ej. intento
              de hackeo o uso indebido). Decidimos discontinuar la plataforma
              (te avisaríamos con anticipación). Si tu cuenta se elimina, tus
              datos se borrarán según lo indicado en nuestra Política de
              Privacidad (sección 8).
            </p>
          </li>
          <li>
            <h4>8. Política de Privacidad</h4>
            <p>
              Acá te explicamos cómo manejamos tu información. 8.1. ¿Qué datos
              recolectamos? Al registrarte: Nombre, apellido, email, número de
              teléfono, nombre de usuario, contraseña (almacenada como hash
              seguro). Al usar PulveSys: Órdenes de pulverización, lotes
              (coordenadas), cultivos, tratamientos, productos, historial de
              cambios. Suscripciones: Estado de la suscripción (pendiente,
              activa, pausada, cancelada) y fecha del próximo pago. Plan
              Empresa: Datos de los usuarios que administrás (sus órdenes,
              cultivos, historiales). Rol Administrador: Nosotros accedemos a
              datos de clientes (nombre, apellido, email, teléfono, estado de
              suscripción) para estadísticas internas y soporte. 8.2. ¿Para qué
              usamos tus datos? Para darte acceso a PulveSys y sus funciones
              (ej. crear órdenes, generar mapas, exportar PDFs). Para gestionar
              tu suscripción y sincronizar pagos con Mercado Pago. Para mejorar
              la plataforma (ej. analizar cómo se usa, detectar errores). Para
              contactarte si es necesario (ej. avisos de soporte,
              actualizaciones). 8.3. ¿Con quién compartimos tus datos? Con
              proveedores técnicos (ej. servidores, hosting) bajo estrictos
              acuerdos de confidencialidad. Con autoridades si lo exige la ley
              (ej. orden judicial). No vendemos, alquilamos ni compartimos tus
              datos con terceros para fines comerciales. 8.4. ¿Cómo protegemos
              tus datos? Usamos medidas de seguridad como almacenamiento seguro
              y contraseñas hasheadas. Limitamos el acceso a nuestro equipo
              autorizado. 8.5. ¿Cuánto tiempo guardamos tus datos? Mientras uses
              PulveSys, mantenemos tus datos activos. Si eliminás tu cuenta, los
              eliminamos en un plazo de 30 días, salvo datos que debamos guardar
              por ley (ej. registros de facturación). 8.7. Cookies Usamos
              cookies para mantenerte logueado. Podés desactivarlas en tu
              navegador, pero algunas funciones podrían no funcionar
              correctamente. 8.8. Consentimiento Al registrarte y marcar “Acepto
              los Términos y Condiciones”, autorizás el uso de tus datos según
              esta política. Podés revocar este consentimiento contactándonos,
              pero esto puede limitar tu acceso a PulveSys.
            </p>
          </li>
          <li>
            <h4>9. Cambios en los Términos y Condiciones</h4>
            <p>
              Podemos actualizar estos términos para reflejar mejoras en
              PulveSys, cambios legales o nuevas funciones. Te avisaremos por
              email o con un aviso al iniciar sesión en la plataforma. Si seguís
              usando PulveSys después de los cambios, significa que los aceptás.
            </p>
          </li>
          <li>
            <h4>10. Contacto</h4>
            <p>
              Si tenés dudas, querés ejercer tus derechos sobre tus datos o
              necesitás soporte, escribinos a soporte@pulvesys.com.
            </p>
          </li>
        </ul>
      </section>
    </>
  );
}
