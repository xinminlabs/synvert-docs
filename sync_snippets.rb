#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'

`cd ../awesomecode-synvert-ruby; sh publish.sh`

snippets = JSON.parse(`docker run xinminlabs/awesomecode-synvert-ruby synvert-ruby --list --format json`)
content = []
snippets.group_by { |snippet| snippet['group'] }.each do |group, snippets|
  content << "### #{group}"
  snippets.each do |snippet|
    content << "<details markdown='1'>"
    content << "<summary>#{snippet['name']}</summary>"
    content << snippet['description']
    content << "</details>"
  end
end
File.write('./ruby/official_snippets.md', <<~EOF)
---
layout: ruby
title: Official Snippets
---

#{content.join("\n\n")}
EOF