
import { render } from '@testing-library/react'

import { LoadingSkeleton } from './LoadingSkeleton'

describe('LoadingSkeleton', () => {

    it('LoadingSkeleton should renders correctly', () => {
        const { container } = render(<LoadingSkeleton />)
        const skeletonElements = container.getElementsByClassName('animate-pulse')
        expect(skeletonElements.length).toBeGreaterThan(0)

    })
})
