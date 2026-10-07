// "Props" are the inputs of a component, like the parameters of a function.
// This type says: PageHeader needs a title (text) and a subtitle (text).
type PageHeaderProps = {
  title: string
  subtitle: string
}

// A reusable title block, so every page looks the same at the top.
function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{subtitle}</p>
    </header>
  )
}

export default PageHeader
