import ShellClient from '@/components/layout/ShellClient'

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return <ShellClient>{children}</ShellClient>
}
