import React from 'react'
import { cn } from '~/lib/utils'
import { IconInput } from '~/components/ui/inputs/icon-input'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { MdOutlinePassword } from 'react-icons/md'

type PasswordInputProps = React.ComponentProps<typeof IconInput> & {
  hint?: string
}
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, prependIcon, appendIcon, hint, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const defaultAppendPassword = () => {
    return showPassword ? (
      <IoMdEye
        className='cursor-pointer'
        onClick={() => setShowPassword(false)}
      />
    ) : (
      <IoMdEyeOff
        className='cursor-pointer'
        onClick={() => setShowPassword(true)}
      />
    )
  }

  return (
    <div className='flex flex-col gap-1'>
      <IconInput
        className={cn('w-full', className)}
        type={showPassword ? 'text' : 'password'}
        prependIcon={prependIcon ?? <MdOutlinePassword />}
        appendIcon={appendIcon ?? defaultAppendPassword()}
        {...props}
        ref={ref}
      />
      {hint && <div className='pl-3 text-xs text-slate-600'>{hint}</div>}
    </div>
  )
})
