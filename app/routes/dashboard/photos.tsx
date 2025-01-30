import type { Route } from './+types/photos'

export default function Photos({ loaderData }: Route.ComponentProps) {
  return (
    <div className='flex flex-col p-4'>
      <h1 className='text-2xl font-bold mb-4'>Photos</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='aspect-square bg-gray-200 rounded-lg'></div>
          <p className='mt-2 text-gray-600'>Photo placeholder</p>
        </div>
        {/* Add more photo placeholders as needed */}
      </div>
    </div>
  )
}
