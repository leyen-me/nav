import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NavigationGrid } from "@/components/navigation-grid"
import { SearchBar } from "@/components/search-bar"
import { FilterBar } from "@/components/filter-bar"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-pattern">
      <Header />
      <main className="flex-1 container px-4 py-8 space-y-8 mx-auto max-w-7xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">发现优质网站</h1>
            <p className="text-muted-foreground">
              精选互联网优质资源，让发现更简单
            </p>
          </div>
          <SearchBar />
          <FilterBar />
        </div>
        <NavigationGrid />
      </main>
      <Footer />
    </div>
  )
}
