---
title = "A counter actor"
shelf = "actors"
level = "Beginner"
order = 1
uses = ["actor", "be"]
card = "Keep changing state safely inside an actor's mailbox."
summary = "A small room with one occupant and a letterbox. Count visitors through a door, from anywhere, without two counts ever colliding."
ingredients = ["`actor`, with a `let` field fixed at creation and a `var` field that changes", "`be` behaviours: messages that return straight away", "Ordinary methods: requests that wait for an answer"]
sample_name = "counter-actor"
layout = "recipe"
permalink = "/cookbook/counter-actor/"
---

## Run it

```text
$ pooka run
5 visitors through the front door
0 visitors through the front door
```

## How it works

<ol class="recipe-steps">
  <li><strong>Creating an actor starts a process.</strong> <code>Visitors("front door")</code> starts a new BEAM process for the actor and hands you a way to reach it.</li>
  <li><strong><code>be</code> drops a letter in the box.</strong> <code>front.arrive()</code> sends a message and returns <code>Nil</code> immediately, without waiting for the count to change.</li>
  <li><strong>Methods ask and wait.</strong> <code>front.report()</code> is a request: it waits in line behind the messages sent before it, then answers. That is why it sees all five arrivals.</li>
  <li><strong>Only the actor touches its <code>var</code>.</strong> Messages are handled one at a time, in order, so <code>count += 1</code> can never be interrupted halfway by another visitor.</li>
</ol>

> An actor is a small room with one occupant and a letterbox. You cannot go in. You can only write.

<div class="callout">
  <span class="ic" aria-hidden="true">✦</span>
  <div><p><strong>Try next:</strong> give the actor a <code>with</code> interface, so code that only needs <code>report()</code> can accept any kind of counter. <a href="/cookbook/fan-out-work/">Fan work out to actors</a> uses several at once.</p></div>
</div>
