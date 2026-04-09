import { Button } from '@/components/ui/Button'
import { UI_TEXT } from '@/lib/constants'

interface FormActionsSectionProps {
  mode: 'create' | 'edit'
  isSubmitting: boolean
  onCancel: () => void
}

/**
 * FormActionsSection renders the cancel and submit buttons
 *
 * @param props - The props for the FormActionsSection component, including mode, submission state, and cancel handler.
 * @param props.mode - The mode of the form, either 'create' or 'edit'.
 * @param props.isSubmitting - Indicates if the form is currently being submitted.
 * @param props.onCancel - The function to call when the cancel button is clicked.
 */
export function FormActionsSection({
  isSubmitting,
  mode,
  onCancel,
}: FormActionsSectionProps): React.ReactElement {
  return (
    <div className="flex gap-4">
      <Button
        disabled={isSubmitting}
        onClick={onCancel}
        type="button"
        variant="secondary"
      >
        {UI_TEXT.buttons.cancel}
      </Button>
      <Button
        className="flex-1"
        disabled={isSubmitting}
        loading={isSubmitting}
        type="submit"
      >
        {mode === 'create' ? UI_TEXT.buttons.save : UI_TEXT.buttons.update}
      </Button>
    </div>
  )
}
