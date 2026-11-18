source "https://rubygems.org"

# Same gem set GitHub Pages uses, so local builds match the real site
gem "github-pages", group: :jekyll_plugins

gem "tzinfo-data"
# Windows file watcher; 0.1.x fails to compile with GCC 14+
gem "wdm", ">= 0.2.0" if Gem.win_platform?
# Ruby 3.0+ no longer bundles the web server jekyll serve needs
gem "webrick"

group :jekyll_plugins do
  gem "jekyll-sitemap"
  gem "jemoji"
end
