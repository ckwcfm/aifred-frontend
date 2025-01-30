import { cn } from '~/lib/utils'
import { Input } from '~/components/ui/input'
import React, { type ReactNode } from 'react'

interface IconInputProps extends React.ComponentProps<typeof Input> {
  prependIcon?: ReactNode
  appendIcon?: ReactNode
}

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, prependIcon, appendIcon, ...props }, ref) => {
    return (
      <div className={cn('relative flex w-full', className)}>
        <div className='absolute inset-y-0 flex items-center pl-3 '>
          {prependIcon}
        </div>
        <Input
          className={cn(prependIcon && 'pl-10', appendIcon && 'pr-10')}
          {...props}
          ref={ref}
        />
        <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
          {appendIcon}
        </div>
      </div>
    )
  }
)
