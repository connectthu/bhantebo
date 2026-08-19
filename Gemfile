source "https://rubygems.org"

# Use the github-pages gem, which pins to the exact set of gem versions
# that GitHub Pages uses to build sites in production. This gives us
# native GitHub Pages compatibility with no custom build step.
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-feed"
end

# Ruby 3.4+ removed these from the default gem set; the github-pages gem's
# pinned (older) dependencies still expect them to just be "there". GitHub's
# own Pages build servers currently run a Ruby version old enough that this
# isn't an issue, but declaring them explicitly keeps `bundle install` happy
# on newer local Rubies too.
gem "csv"
gem "logger"
gem "base64"
gem "bigdecimal"

# Windows/JRuby compatibility shims (harmless on other platforms).
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", platforms: [:mingw, :x64_mingw]
gem "http_parser.rb", "~> 0.6.0", platforms: [:jruby]
