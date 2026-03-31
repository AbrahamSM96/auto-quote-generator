/* eslint-disable no-console */
import { prisma } from '../lib/prisma'

/**
 * main Function
 *
 * This script checks the current state of the system by counting the total number of users and quotations in the database. It lists all existing users with their details and indicates if the Master user is present. It also provides guidance on how to reset the Master user if needed. Finally, it counts and displays the total number of quotations in the system.
 */
async function main(): Promise<void> {
  console.log('🔍 Verificando estado del sistema...\n')

  const userCount = await prisma.user.count()
  console.log(`👥 Total de usuarios: ${userCount}`)

  if (userCount > 0) {
    console.log('\n📋 Usuarios en el sistema:')
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        createdAt: true,
        email: true,
        id: true,
        name: true,
      },
    })

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Creado: ${user.createdAt.toLocaleString()}`)
      if (index === 0) {
        console.log('   ⭐ MASTER USER')
      }
    })

    console.log(
      '\n⚠️  La página /register está bloqueada porque ya existen usuarios.'
    )
    console.log('   Para poder registrar un nuevo Master, ejecuta:')
    console.log('   bun run dev:reset-master')
  } else {
    console.log('\n✅ No hay usuarios en el sistema.')
    console.log('   Puedes acceder a /register para crear el usuario Master.')
  }

  const quotationCount = await prisma.quotation.count()
  console.log(`\n📝 Total de cotizaciones: ${quotationCount}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
