---
layout: default
title: Events
permalink: /events/
---
<div class="wrap page-header">
  <div class="eyebrow">Join In Person</div>
  <h1>Upcoming Events</h1>
</div>

<div class="section wrap">
  {% assign all_events = site.events | sort: 'date' %}
  {% if all_events.size > 0 %}
  <div class="events-list">
    {% for event in all_events %}
      {% include event-row.html event=event %}
    {% endfor %}
  </div>
  {% else %}
  <p class="lede">No events scheduled yet &mdash; check back soon.</p>
  {% endif %}
</div>
