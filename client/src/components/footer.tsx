
export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 backdrop-blur-sm">
      <div className="container px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-md rotate-45 transform-gpu" />
                <div className="absolute inset-[2px] bg-background rounded-[4px] flex items-center justify-center">
                  <span className="font-bold text-primary">CT</span>
                </div>
              </div>
              <span className="font-bold text-xl">CodeNest</span>
            </div>
            <p className="text-muted-foreground max-w-xs text-center md:text-left">
              The ultimate real-time collaborative coding platform for teams and developers.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">            <p className="text-sm text-muted-foreground mb-2">
              &copy; {new Date().getFullYear()} CodeNest. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}