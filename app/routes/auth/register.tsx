import { Button } from '~/components/ui/button'
import { IconInput } from '~/components/ui/inputs/icon-input'
import { Label } from '~/components/ui/label'
import { useContext, useState } from 'react'
import { MdOutlineEmail, MdOutlineLock } from 'react-icons/md'
import { PasswordInput } from '~/components/ui/inputs/password-input'
import { PASSWORD_RULE } from '~/constants/auth.constants'
import { NavLink } from 'react-router'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // onRegister({ email, password, confirmPassword })
  }

  return (
    <div className='flex flex-col justify-center items-center w-full h-full gap-4'>
      <div className='text-4xl font-bold'>AiFred</div>
      <div className='bg-slate-100 flex flex-col p-4 w-1/2 rounded gap-4'>
        <div className='text-2xl font-bold'>Register</div>
        <form className='flex flex-col gap-4'>
          <div>
            <Label htmlFor='email'>Email</Label>
            <IconInput
              prependIcon={<MdOutlineEmail />}
              id='email'
              type='text'
              placeholder='Username'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='password'>Password</Label>
            <PasswordInput
              id='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint={`* ${PASSWORD_RULE}`}
            />
          </div>

          <div>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <PasswordInput
              id='confirmPassword'
              placeholder='Confirm Password'
              prependIcon={<MdOutlineLock />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type='submit' onClick={onSubmit}>
            Register
          </Button>
        </form>
      </div>
      <div>
        <div className='flex gap-2'>
          <div>Already have an account? </div>
          <NavLink
            className={
              'cursor-pointer hover:font-bold hover:underline transition-all'
            }
            to='/auth/login'
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>
  )
}
