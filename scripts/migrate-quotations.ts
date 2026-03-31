/* eslint-disable no-console */
import { prisma } from '../lib/prisma'

/**
 * main Function
 *
 * This script migrates quotations with a placeholder userId to the Master user. It updates the userId of these quotations and removes the placeholder user if it exists. This is useful for maintaining data consistency after implementing authentication.
 
 */
async function main(): Promise<void> {
  const masterUser = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  if (!masterUser) {
    console.log('No Master user found. Register first.')
    process.exit(1)
  }

  console.log(`Found Master user: ${masterUser.name} (${masterUser.email})`)

  // Find quotations with placeholder userId (those that were created before auth was implemented)
  const quotationsToMigrate = await prisma.quotation.findMany({
    select: {
      clientName: true,
      folio: true,
      id: true,
    },
    where: {
      userId: 'placeholder-user-id',
    },
  })

  if (quotationsToMigrate.length === 0) {
    console.log('No quotations to migrate.')
    return
  }

  console.log(`Found ${quotationsToMigrate.length} quotations to migrate:`)
  quotationsToMigrate.forEach((q) => {
    console.log(`  - Folio ${q.folio}: ${q.clientName}`)
  })

  const result = await prisma.quotation.updateMany({
    data: { userId: masterUser.id },
    where: {
      userId: 'placeholder-user-id',
    },
  })

  console.log(`\nMigrated ${result.count} quotations to Master user`)

  // Clean up placeholder user if it exists
  const placeholderUser = await prisma.user.findUnique({
    where: { id: 'placeholder-user-id' },
  })

  if (placeholderUser) {
    await prisma.user.delete({
      where: { id: 'placeholder-user-id' },
    })
    console.log('Removed placeholder user')
  }

  console.log('\nMigration completed successfully!')
}

main()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
