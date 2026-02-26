export function Capability({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-2 max-w-md">
      <h3 className="text-black dark:text-white text-lg font-medium">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">
        {description}
      </p>
    </div>
  )
}