import { Card } from '@/components/ui/Card'
import { CardContent } from '@/components/ui/CardContent'
import { CardHeader } from '@/components/ui/CardHeader'
import { CardTitle } from '@/components/ui/CardTitle'
import { UI_TEXT } from '@/lib/constants'
import { workshopConfig } from '@/config/workshop'

/**
 * WorkshopProfileSection displays read-only workshop information
 */
export function WorkshopProfileSection(): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-2xl">🏢</span>
        </div>
        <CardTitle>{UI_TEXT.sections.workshop}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm tracking-wide text-text-secondary uppercase">
              Encargado
            </p>
            <p className="font-medium text-text-primary">
              {workshopConfig.manager}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm tracking-wide text-text-secondary uppercase">
              Teléfono
            </p>
            <p className="font-technical font-medium text-text-primary">
              {workshopConfig.phone}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm tracking-wide text-text-secondary uppercase">
              Email
            </p>
            <p className="font-medium text-text-primary">
              {workshopConfig.email}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm tracking-wide text-text-secondary uppercase">
              Dirección
            </p>
            <p className="font-medium text-text-primary">
              {workshopConfig.address}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
