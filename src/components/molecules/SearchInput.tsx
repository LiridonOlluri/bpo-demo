import { Input } from '@/components/atoms/Input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
    return (
        <div className={cn('relative', containerClassName)}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
            <Input className={cn('pl-9', className)} placeholder="Search..." {...props} />
        </div>
    )
}
