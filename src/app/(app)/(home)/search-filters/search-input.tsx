'use client'

import { ListFilterIcon, SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { CategoriesSidebar } from './categories-sidebar'

interface Props {
	disabled?: boolean
}

export const SearchInput = ({ disabled }: Props) => {
	const trpc = useTRPC()
	const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	return (
		<div className='flex items-center gap-2 w-full'>
			<CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data} />
			<div className='relative w-full'>
				<SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500' />
				<Input className='pl-8' placeholder='Search products' disabled={disabled} />
			</div>
			{/* TODO: Add categories view all button */}
			<Button variant='elevated' className='size-12 shrink-0 flex lg:hidden' onClick={() => setIsSidebarOpen(true)}>
				<ListFilterIcon />
			</Button>
			{/* TODO: Add library button */}
		</div>
	)
}
