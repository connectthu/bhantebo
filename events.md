---
layout: default
title: Events
description: Information about confirmed public meditation sessions, Dhamma gatherings and community activities with Venerable Bodhicitta.
permalink: /events/
---
<div class="wrap page-header"><div class="eyebrow">In Community</div><h1>Events</h1><p class="lede">Confirmed public meditation sessions, Dhamma gatherings and community activities.</p></div>

<section class="section wrap">
  {% assign confirmed_events = site.events | where: "confirmed", true | sort: "date" %}
  {% assign today = site.time | date: "%Y-%m-%d" %}
  {% assign has_upcoming = false %}
  {% for event in confirmed_events %}
    {% assign event_day = event.date | date: "%Y-%m-%d" %}
    {% if event_day >= today %}{% assign has_upcoming = true %}{% endif %}
  {% endfor %}
  {% if has_upcoming %}
    <div class="events-list">
    {% for event in confirmed_events %}
      {% assign event_day = event.date | date: "%Y-%m-%d" %}
      {% if event_day >= today %}
      <article class="event-card">
        {% if event.poster and event.poster != "" %}
        <img class="event-poster-image" src="{{ event.poster | relative_url }}" alt="Poster for Sound Meditation with Venerable Bodhicitta, featuring audience reviews, free admission, and event details for December 12, 2026 at 7 PM in Peterborough.">
        {% else %}
        <div class="event-poster-placeholder" role="img" aria-label="Event poster placeholder. Replace with the approved Sound Bath event poster.">
          <span class="eyebrow">Poster placeholder</span><strong>{{ event.title }}</strong><span>Event poster to be added</span>
        </div>
        {% endif %}
        <div class="event-card-content">
          <div class="event-date">{{ event.date | date: "%B %-d, %Y" }}</div>
          <h2>{{ event.title }}</h2>
          {% if event.time %}<p class="event-time">{{ event.time }}</p>{% endif %}
          <p class="event-location">{{ event.location }}</p>
          {% if event.address %}<p class="event-address">{{ event.address }}</p>{% endif %}
          <p class="event-description">{{ event.description }}</p>
          {% if event.eventbrite_url and event.eventbrite_url != "" %}
            <a class="btn btn-primary" href="{{ event.eventbrite_url }}" target="_blank" rel="noopener noreferrer">Sign up on Eventbrite <span class="visually-hidden">(opens in a new tab)</span></a>
          {% else %}
            <button class="btn btn-primary" type="button" disabled aria-disabled="true" title="Eventbrite registration link to be added">Sign up link coming soon</button>
          {% endif %}
        </div>
      </article>
      {% endif %}
    {% endfor %}
    </div>
  {% else %}
    <p class="lede">There are no upcoming events listed at this time. Please check back for future confirmed activities.</p>
  {% endif %}
  <p class="lede event-contact">For an inquiry about an event, <a href="mailto:{{ site.email }}">get in touch by email</a>.</p>
</section>
