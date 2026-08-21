# Public content publication plan

Status: prepared for review only. Nothing in this file has been published to the production CMS or database.

## Testimonials

Update the existing published records by matching `member_name`. Preserve their current images, publication settings, and sort order.

### Paul Callaghan

After moving to Hertfordshire in late 2021, I was keen to find a local lodge that met on dates that suited my shift pattern at work. After visiting a few lodges in Hertfordshire, I found Radlett Lodge No. 6652 in late 2023.

The brethren of Radlett Lodge were welcoming and friendly, with members of all ages and levels of experience. The ritual in the temple was of a superb standard and extremely well presented.

Most importantly, they held a very enjoyable Festive Board. I was sold and joined in early 2024. I now have a new circle of brethren whom I can also call my friends.

### Chris Radford

I have been a member of Radlett Lodge for 40 years. During that time, the Lodge has gone through periods when membership fell because members moved away or, sadly, passed away. At those times, the Lodge pulled through because of the strength of the friendships between its members.

That friendship continues to this day. The Lodge is thriving, with healthy recruitment and joining members who are impressed by the warmth and conviviality of its members. I am proud to be a member of Radlett Lodge.

### Mike Davis

I was introduced to Freemasonry by Brother Paul Callaghan. I had always been interested in Freemasonry and had asked him about it several times. It seemed like a close brotherhood that looked after one another and raised money for charity.

I joined Radlett Lodge because I already knew a couple of its brethren, and they spoke very highly of it. It is also close to where I live, and its Saturday meetings are perfect for me.

I recently completed my Third Degree, but from the start everyone at Radlett Lodge has been great with me and welcomed me with open arms. It is a very friendly Lodge: everyone helps one another with ritual, and the standards are very high. The food is unbelievable too! If you enjoy socialising and want to make like-minded friends, this is the Lodge for you.

The surrounding quotation marks are intentionally omitted because the website's testimonial card adds them when rendering.

## Charity wording

Use this wording wherever a charity statistic is shown:

> Radlett Lodge supported 12 charities in 2025. Across England and Wales, Freemasons donate approximately £52 million to charitable causes each year.

Attribute the national figure to the [United Grand Lodge of England](https://www.ugle.org.uk/). The first sentence is the Lodge's local 2025 figure; the second is the national figure. Do not describe £52 million as money raised by Radlett Lodge.

The homepage wording and attribution are included in this repository branch. The production `site_settings` values still require a later CMS/database update after approval.

## Events

Times below use the `Europe/London` time zone. The UTC values are included to avoid a one-hour error when the records are later published.

### Radlett Lodge Regular Meeting

- Local date and time: Saturday 5 September 2026 at 4:00 pm BST
- Database UTC date and time: `2026-09-05T15:00:00Z`
- Venue: Radlett Masonic Centre, Rose Walk, Radlett, Hertfordshire, WD7 7JS
- Publicly visible (`is_public`): `true`
- Members only (`is_members_only`): `true`
- Past event (`is_past_event`): `false`
- Event type: `regular`
- Description: The September Regular Meeting of Radlett Lodge No. 6652, followed by the Festive Board. Visiting Freemasons are warmly invited to contact the Lodge Secretary for further information.
- Contact link: `/contact`

### Installation Meeting

- Local date and time: Saturday 12 December 2026 at 4:00 pm GMT
- Database UTC date and time: `2026-12-12T16:00:00Z`
- Venue: Radlett Masonic Centre, Rose Walk, Radlett, Hertfordshire, WD7 7JS
- Publicly visible (`is_public`): `true`
- Members only (`is_members_only`): `true`
- Past event (`is_past_event`): `false`
- Event type: `special`
- Description: The annual Installation Meeting of Radlett Lodge No. 6652, followed by the Installation Festive Board. Visiting Freemasons should contact the Lodge Secretary for attendance details.
- Contact link: `/contact`

### Pre-publication checks

- The current event form has no dedicated contact-link field. The event details modal already sends visitors to `/contact`, so no schema change is required for this link.
- The current public Row Level Security policy permits signed-out visitors to read only events where `is_members_only` is false. These requested records combine `is_public = true` with `is_members_only = true`, so they will not actually be visible to signed-out visitors under the current policy. Resolve the intended visibility model in a separate, security-reviewed change before publication; do not weaken the policy as part of this content update.
- Confirm the event details and corrected testimonials with the Lodge before publishing.
