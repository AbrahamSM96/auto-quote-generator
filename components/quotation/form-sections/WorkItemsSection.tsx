import type {
  FieldArrayWithId,
  FieldErrors,
  Path,
  UseFormRegister,
} from 'react-hook-form'

import { Input } from '@/components/ui/Input'
import type { QuotationFormData } from '@/types'
import { UI_TEXT } from '@/lib/constants'

type ItemType = 'bodywork' | 'paint' | 'parts' | 'mechanical'

interface WorkItemConfig {
  icon: string
  title: string
  addButtonText: string
  descriptionPlaceholder: string
  fieldLayout: 'simple' | 'paint'
}

const WORK_ITEM_CONFIG: Record<ItemType, WorkItemConfig> = {
  bodywork: {
    addButtonText: UI_TEXT.buttons.addBodywork,
    descriptionPlaceholder: UI_TEXT.placeholders.bodyworkDescription,
    fieldLayout: 'simple',
    icon: '🔨',
    title: UI_TEXT.sections.bodywork,
  },
  mechanical: {
    addButtonText: UI_TEXT.buttons.addMechanical,
    descriptionPlaceholder: UI_TEXT.placeholders.mechanicalDescription,
    fieldLayout: 'simple',
    icon: '🔧',
    title: UI_TEXT.sections.mechanical,
  },
  paint: {
    addButtonText: UI_TEXT.buttons.addPaint,
    descriptionPlaceholder: UI_TEXT.placeholders.paintPart,
    fieldLayout: 'paint',
    icon: '🎨',
    title: UI_TEXT.sections.paint,
  },
  parts: {
    addButtonText: UI_TEXT.buttons.addPart,
    descriptionPlaceholder: UI_TEXT.placeholders.partDescription,
    fieldLayout: 'simple',
    icon: '💡',
    title: UI_TEXT.sections.parts,
  },
}

interface WorkItemsSectionProps {
  type: ItemType
  fields: FieldArrayWithId<QuotationFormData>[]
  register: UseFormRegister<QuotationFormData>
  errors: FieldErrors<QuotationFormData>
  onAppend: () => void
  onRemove: (index: number) => void
  sectionNumber: number
  total: number
}

/**
 * WorkItemsSection is a generic reusable component for all work item types
 * Supports two field layouts: 'simple' (description + cost) and 'paint' (part + quantity + unitPrice + total)
 *
 * @param props - The props for the WorkItemsSection component, including item type, form fields, registration, error handling, and item management handlers.
 * @param props.type - The type of work items (bodywork, paint, parts, mechanical) which determines the layout and configuration.
 * @param props.fields  - The array of work item fields managed by react-hook-form's useFieldArray.
 * @param props.register - The register function from react-hook-form for form fields.
 * @param props.onAppend - The function to call when the add button is clicked to append a new work item.
 * @param props.onRemove - The function to call when the remove button is clicked to remove a work item by index.
 * @param props.sectionNumber - The section number to display in the header.
 * @param props.total   - The total cost for this section, calculated from the work items.
 */
export function WorkItemsSection({
  fields,
  onAppend,
  onRemove,
  register,
  sectionNumber,
  total,
  type,
}: WorkItemsSectionProps): React.ReactElement {
  const config = WORK_ITEM_CONFIG[type]

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-dark-border/50 bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white">
            {sectionNumber}
          </div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary uppercase">
            <span className="text-xl">{config.icon}</span>
            {config.title}
          </h3>
        </div>
        <span className="font-technical text-2xl font-bold text-primary">
          ${total.toFixed(2)}
        </span>
      </div>
      <div className="space-y-3 p-6">
        {fields.map((field, index) => (
          <div
            className="group flex items-center gap-3 rounded-xl border border-dark-border/50 bg-dark-elevated p-4 transition-colors hover:border-primary/30"
            key={field.id}
          >
            {config.fieldLayout === 'simple' ? (
              <>
                {/* Simple layout: description + cost */}
                <Input
                  {...register(`${type}Items.${index}.description` as Path<QuotationFormData>)}
                  className="flex-1"
                  error={
                    `${type}Items.${index}.description` as Path<QuotationFormData>
                  }
                  placeholder={config.descriptionPlaceholder}
                />
                <Input
                  {...register(`${type}Items.${index}.cost` as Path<QuotationFormData>)}
                  className="w-32 text-right font-technical"
                  error={
                    `${type}Items.${index}.cost` as Path<QuotationFormData>
                  }
                  placeholder="$0.00"
                  type="number"
                />
              </>
            ) : (
              <>
                {/* Paint layout: part + quantity + unitPrice + total */}
                <Input
                  {...register(`${type}Items.${index}.part` as Path<QuotationFormData>)}
                  className="flex-1"
                  error={
                    `${type}Items.${index}.part` as Path<QuotationFormData>
                  }
                  placeholder={config.descriptionPlaceholder}
                />
                <Input
                  {...register(`${type}Items.${index}.quantity` as Path<QuotationFormData>)}
                  className="w-20 text-center font-technical"
                  error={
                    `${type}Items.${index}.quantity` as Path<QuotationFormData>
                  }
                  placeholder="Cant."
                  type="number"
                />
                <Input
                  {...register(`${type}Items.${index}.unitPrice` as Path<QuotationFormData>)}
                  className="w-28 text-right font-technical"
                  error={
                    `${type}Items.${index}.unitPrice` as Path<QuotationFormData>
                  }
                  placeholder="P. Unit."
                  type="number"
                />
                <Input
                  {...register(`${type}Items.${index}.total` as Path<QuotationFormData>)}
                  className="w-32 bg-dark-bg text-right font-technical"
                  placeholder="$0.00"
                  readOnly
                  type="number"
                />
              </>
            )}
            <button
              className="h-10 w-10 rounded-lg bg-red-500/10 text-red-400 opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-500/20"
              /* istanbul ignore next */
              onClick={() => onRemove(index)}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
        <button
          className="w-full rounded-xl border-2 border-dashed border-dark-border py-4 font-medium text-text-secondary transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
          onClick={onAppend}
          type="button"
        >
          {config.addButtonText}
        </button>
      </div>
    </div>
  )
}
