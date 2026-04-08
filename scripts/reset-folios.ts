#!/usr/bin/env bun
/* eslint-disable no-console */
/**
 * Script to reset quotation folios to sequential numbers (1, 2, 3...)
 */

import { createInterface } from 'readline'

import { prisma } from '../lib/prisma'

/**
 * main - Resets folios of all quotations to be sequential based on creation date.
 */
async function main(): Promise<void> {
  console.log('🔍 Checking current quotations...\n')

  // Get all quotations ordered by creation date
  const quotations = await prisma.quotation.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      clientName: true,
      createdAt: true,
      folio: true,
      id: true,
    },
  })

  if (quotations.length === 0) {
    console.log('❌ No quotations found in database')
    return
  }

  console.log(`Found ${quotations.length} quotations:\n`)
  quotations.forEach((q, index) => {
    console.log(
      `  ${index + 1}. Folio: ${String(q.folio).padStart(3, '0')} | Client: ${q.clientName} | Created: ${q.createdAt.toLocaleDateString()}`
    )
  })

  console.log(
    '\n📋 This script will reset folios to sequential numbers (1, 2, 3...)'
  )
  console.log('   based on creation date (oldest = folio 1)\n')

  // Ask for confirmation
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const answer = await new Promise<string>((resolve) => {
    readline.question('Continue? (yes/no): ', resolve)
  })

  readline.close()

  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('\n❌ Operation cancelled')
    return
  }

  console.log('\n🔄 Resetting folios...\n')

  // Update folios sequentially
  for (let i = 0; i < quotations.length; i++) {
    const newFolio = i + 1
    await prisma.quotation.update({
      data: { folio: newFolio },
      where: { id: quotations[i].id },
    })
    console.log(
      `  ✓ ${quotations[i].clientName}: ${quotations[i].folio} → ${newFolio}`
    )
  }

  console.log('\n✅ Folios reset successfully!')

  // Reset PostgreSQL sequence to match the highest folio
  const maxFolio = quotations.length
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"Quotation"', 'folio'),
      ${maxFolio},
      true
    )
  `
  console.log(`🔄 PostgreSQL sequence reset to: ${maxFolio}`)
  console.log(`   Next folio will be: ${maxFolio + 1}\n`)

  // Show final state
  const updated = await prisma.quotation.findMany({
    orderBy: { folio: 'asc' },
    select: {
      clientName: true,
      folio: true,
    },
  })

  console.log('📊 Final state:')
  updated.forEach((q) => {
    console.log(`  Folio ${String(q.folio).padStart(3, '0')}: ${q.clientName}`)
  })
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
