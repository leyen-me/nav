export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 mx-auto max-w-7xl">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} NAV. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

