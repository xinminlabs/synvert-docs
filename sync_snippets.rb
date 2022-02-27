#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'

%w[ruby javascript].each do |language|
  `cd ../awesomecode-synvert-#{language}; sh publish.sh`

  snippets = JSON.parse(`docker run xinminlabs/awesomecode-synvert-#{language} synvert-#{language} --list --format json`)
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
  File.write("./#{language}/official_snippets.md", <<~EOF)
  ---
  layout: #{language}
  title: Official Snippets
  ---

  #{content.join("\n\n")}
  EOF
end