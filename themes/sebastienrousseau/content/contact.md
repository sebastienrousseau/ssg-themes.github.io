---
name: "Editorial Hub"
short_name: "EH"
title: "Contact & Editorial Submissions | Editorial Hub"
description: "Get in touch with the editorial team or submit research papers for review."
keywords: "Contact, Submissions, Editorial"
author: "Editorial Research Group"
date: "2026-08-05"
language: "en-GB"
layout: "contact"
permalink: "https://example.com/contact.html"
---

# Contact &amp; Submissions

<form class="contact-form" action="https://formspree.io/f/example" method="POST">
  <div class="form-group" style="margin-bottom:1rem;">
    <label for="name" style="display:block; font-weight:700;">Full Name</label>
    <input type="text" id="name" name="name" required style="width:100%; padding:0.75rem; border:1px solid var(--line); border-radius:6px;">
  </div>
  <div class="form-group" style="margin-bottom:1rem;">
    <label for="email" style="display:block; font-weight:700;">Email Address</label>
    <input type="email" id="email" name="email" required style="width:100%; padding:0.75rem; border:1px solid var(--line); border-radius:6px;">
  </div>
  <div class="form-group" style="margin-bottom:1.5rem;">
    <label for="message" style="display:block; font-weight:700;">Submission / Enquiry Details</label>
    <textarea id="message" name="message" rows="5" required style="width:100%; padding:0.75rem; border:1px solid var(--line); border-radius:6px;"></textarea>
  </div>
  <button type="submit" class="btn-primary">Submit to Editorial Board</button>
</form>
