"use client"
import { Github, Twitter, Linkedin } from "lucide-react"
import React from "react"

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Roadmap", href: "#roadmap" },
        { name: "Documentation", href: "#docs" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about" },
        { name: "Blog", href: "#blog" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Community", href: "#community" },
        { name: "Help Center", href: "#help" },
        { name: "Partners", href: "#partners" },
        { name: "Status", href: "#status" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "#privacy" },
        { name: "Terms", href: "#terms" },
        { name: "Security", href: "#security" },
        { name: "Cookies", href: "#cookies" },
      ],
    },
  ]

  return (
    <footer className="border-t border-border/40 bg-muted/20 backdrop-blur-sm">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-md rotate-45 transform-gpu" />
                <div className="absolute inset-[2px] bg-background rounded-[4px] flex items-center justify-center">
                  <span className="font-bold text-primary">CT</span>
                </div>
              </div>
              <span className="font-bold text-xl">CodeTogether</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-xs">
              The ultimate real-time collaborative coding platform for teams and developers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((group, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CodeTogether. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}