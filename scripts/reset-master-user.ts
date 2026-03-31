/* eslint-disable no-console */
import { prisma } from '../lib/prisma'

/**
 * main Function
 *
 * This script resets the Master user by deleting all users and their associated data (quotations, sessions, accounts) from the database. It provides feedback on the number of records deleted and resets the quotation folio sequence. This is useful for starting fresh with a new Master user account.
 */
async function main(): Promise<void> {
  console.log('🔍 Buscando usuario Master...')

  const masterUser = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  if (!masterUser) {
    console.log('❌ No se encontró ningún usuario Master.')
    return
  }

  console.log(`\n📋 Usuario Master encontrado:`)
  console.log(`   - ID: ${masterUser.id}`)
  console.log(`   - Nombre: ${masterUser.name}`)
  console.log(`   - Email: ${masterUser.email}`)
  console.log(`   - Creado: ${masterUser.createdAt.toLocaleString()}`)

  // Contar cotizaciones del usuario
  const quotationCount = await prisma.quotation.count({
    where: { userId: masterUser.id },
  })

  console.log(`   - Cotizaciones: ${quotationCount}`)

  // Contar otros usuarios
  const otherUsersCount = await prisma.user.count({
    where: { id: { not: masterUser.id } },
  })

  if (otherUsersCount > 0) {
    console.log(
      `\n⚠️  Hay ${otherUsersCount} usuario(s) adicional(es) en el sistema.`
    )
    console.log('   Estos usuarios también serán eliminados.')
  }

  console.log('\n🗑️  Eliminando todos los usuarios...')

  try {
    // Contar TODAS las cotizaciones en el sistema
    const totalQuotations = await prisma.quotation.count()

    if (totalQuotations > 0) {
      console.log(
        `\n⚠️  ${totalQuotations} cotización(es) en total serán eliminadas`
      )
      console.log(
        '   Si quieres mantener las cotizaciones, cancela ahora (Ctrl+C)'
      )

      // Esperar 3 segundos para dar tiempo de cancelar
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    // Eliminar TODAS las cotizaciones (de todos los usuarios)
    const deletedQuotations = await prisma.quotation.deleteMany()
    console.log(`   ✅ Eliminadas ${deletedQuotations.count} cotización(es)`)

    // Resetear la secuencia de autoincrement del folio
    await prisma.$executeRawUnsafe(
      'ALTER SEQUENCE "Quotation_folio_seq" RESTART WITH 1'
    )
    console.log(`   ✅ Secuencia de folio reseteada a 1`)

    // Eliminar todas las sesiones
    await prisma.session.deleteMany()
    console.log(`   ✅ Sesiones eliminadas`)

    // Eliminar todas las cuentas
    await prisma.account.deleteMany()
    console.log(`   ✅ Cuentas eliminadas`)

    // Eliminar todos los usuarios
    const deletedUsers = await prisma.user.deleteMany()
    console.log(`   ✅ Eliminados ${deletedUsers.count} usuario(s)`)

    console.log('\n✨ Sistema reiniciado correctamente.')
    console.log(
      '   Ahora puedes registrar un nuevo usuario Master en /register'
    )
  } catch (error) {
    console.error('\n❌ Error al eliminar usuarios:', error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
