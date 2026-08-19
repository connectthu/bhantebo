---
layout: default
title: Reflections
permalink: /reflections/
---
<div class="wrap page-header">
  <div class="eyebrow">Every Day, On The Path</div>
  <h1>Reflections</h1>
  <p class="lede">Daily photos and short reflections from the training walk. Subscribe via <a href="{{ '/reflections/feed.xml' | relative_url }}">RSS</a> to follow along.</p>
</div>

<div class="section wrap">
  {% assign all_reflections = site.reflections | sort: 'date' | reverse %}
  {% if all_reflections.size > 0 %}
  <div class="feed feed--grid">
    {% for reflection in all_reflections %}
      {% include reflection-card.html reflection=reflection %}
    {% endfor %}
  </div>
  {% else %}
  <p class="lede">No reflections posted yet &mdash; check back soon.</p>
  {% endif %}
</div>
