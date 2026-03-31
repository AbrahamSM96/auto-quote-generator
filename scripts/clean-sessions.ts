/* eslint-disable no-console */
import { prisma } from '../lib/prisma'

/**
 * main Function
 *
 * This script cleans up all existing sessions in the database. It deletes all session records and provides feedback on the number of sessions removed. This is useful for resetting the session state before running migrations or other maintenance tasks.
 
 */
async function main(): Promise<void> {
  console.log('🧹 Limpiando sesiones existentes...')

  const result = await prisma.session.deleteMany()

  console.log(`✅ Eliminadas ${result.count} sesión(es)`)
  console.log('Ahora puedes ejecutar la migración')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
