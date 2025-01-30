import { Button } from '~/components/ui/button'
import type { Route } from './+types/settings'

export default function Settings({ loaderData }: Route.ComponentProps) {
  return (
    <div className='flex flex-col p-4'>
      <h1 className='text-2xl font-bold mb-4'>Settings</h1>
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <span className='text-gray-700'>Notifications</span>
            <Button variant='outline'>Configure</Button>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-gray-700'>Privacy</span>
            <Button variant='outline'>Manage</Button>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-gray-700'>Account</span>
            <Button variant='outline'>Edit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
